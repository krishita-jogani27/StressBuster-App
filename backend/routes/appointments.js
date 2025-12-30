// Appointments Routes
// Appointment management endpoints
// Author: StressBuster Team

const express = require('express');
const router = express.Router();
const { executeQuery, getOne, insert, update } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validator');

// ============================================
// GET ALL COUNSELORS
// GET /api/appointments/counselors
// ============================================
router.get('/counselors', async (req, res, next) => {
    try {
        console.log('📋 Fetching counselors list');

        const counselors = await executeQuery(
            `SELECT id, name, specialization, qualification, experience_years, 
                    rating, available_days, available_time_start, available_time_end
             FROM counselors 
             WHERE is_active = TRUE
             ORDER BY rating DESC, name ASC`
        );

        console.log(`✅ Found ${counselors.data.length} counselors`);
        return successResponse(res, counselors.data, 'Counselors retrieved successfully');
    } catch (error) {
        console.error('❌ Error fetching counselors:', error.message);
        next(error);
    }
});

// ============================================
// GET AVAILABLE SLOTS FOR A COUNSELOR
// GET /api/appointments/slots/:counselorId/:date
// ============================================
router.get('/slots/:counselorId/:date', async (req, res, next) => {
    try {
        const { counselorId, date } = req.params;
        console.log(`📅 Fetching slots for counselor ${counselorId} on ${date}`);

        // Get counselor's available time
        const counselor = await getOne(
            'SELECT available_time_start, available_time_end FROM counselors WHERE id = ? AND is_active = TRUE',
            [counselorId]
        );

        if (!counselor.data) {
            return errorResponse(res, 'Counselor not found', 404);
        }

        // Get booked slots for this counselor on this date
        const bookedSlots = await executeQuery(
            `SELECT appointment_time FROM appointments 
             WHERE counselor_id = ? AND appointment_date = ? 
             AND status IN ('pending', 'confirmed')`,
            [counselorId, date]
        );

        // Generate available slots (9 AM to 5 PM, 1-hour slots)
        const slots = [];
        const startHour = 9;
        const endHour = 17;

        for (let hour = startHour; hour < endHour; hour++) {
            const timeSlot = `${hour.toString().padStart(2, '0')}:00:00`;

            // Check if slot is already booked
            const isBooked = bookedSlots.data.some(slot =>
                slot.appointment_time === timeSlot
            );

            if (!isBooked) {
                slots.push(timeSlot);
            }
        }

        console.log(`✅ Found ${slots.length} available slots`);
        return successResponse(res, slots, 'Available slots retrieved successfully');
    } catch (error) {
        console.error('❌ Error fetching slots:', error.message);
        next(error);
    }
});

// ============================================
// BOOK AN APPOINTMENT
// POST /api/appointments
// ============================================
router.post('/',
    authenticate,
    [
        body('counselorId').isInt().withMessage('Valid counselor ID is required'),
        body('appointmentDate').isDate().withMessage('Valid date is required'),
        body('appointmentTime').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Valid time is required (HH:MM:SS)'),
        body('isAnonymous').optional().isBoolean(),
        validate
    ],
    async (req, res, next) => {
        try {
            const { counselorId, appointmentDate, appointmentTime, isAnonymous } = req.body;
            const userId = req.user.userId;

            console.log(`📝 Booking appointment for user ${userId} with counselor ${counselorId}`);

            // Check if counselor exists and is active
            const counselor = await getOne(
                'SELECT id FROM counselors WHERE id = ? AND is_active = TRUE',
                [counselorId]
            );

            if (!counselor.data) {
                return errorResponse(res, 'Counselor not found or inactive', 404);
            }

            // Check if slot is already booked
            const existingAppointment = await getOne(
                `SELECT id FROM appointments 
                 WHERE counselor_id = ? AND appointment_date = ? AND appointment_time = ? 
                 AND status IN ('pending', 'confirmed')`,
                [counselorId, appointmentDate, appointmentTime]
            );

            if (existingAppointment.data) {
                return errorResponse(res, 'This time slot is already booked', 409);
            }

            // Create appointment
            const result = await insert(
                `INSERT INTO appointments (user_id, counselor_id, appointment_date, appointment_time, is_anonymous, status) 
                 VALUES (?, ?, ?, ?, ?, 'pending')`,
                [userId, counselorId, appointmentDate, appointmentTime, isAnonymous || false]
            );

            if (!result.success) {
                return errorResponse(res, 'Failed to book appointment', 500);
            }

            console.log(`✅ Appointment booked successfully (ID: ${result.insertId})`);
            return successResponse(res, {
                appointmentId: result.insertId,
                counselorId,
                appointmentDate,
                appointmentTime,
                status: 'pending'
            }, 'Appointment booked successfully', 201);

        } catch (error) {
            console.error('❌ Error booking appointment:', error.message);
            next(error);
        }
    }
);

// ============================================
// GET USER'S APPOINTMENTS
// GET /api/appointments/my
// ============================================
router.get('/my', authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        console.log(`📋 Fetching appointments for user ${userId}`);

        const appointments = await executeQuery(
            `SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.created_at,
                    c.name as counselor_name, c.specialization, c.qualification
             FROM appointments a
             LEFT JOIN counselors c ON a.counselor_id = c.id
             WHERE a.user_id = ?
             ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
            [userId]
        );

        console.log(`✅ Found ${appointments.data.length} appointments`);
        return successResponse(res, appointments.data, 'Appointments retrieved successfully');
    } catch (error) {
        console.error('❌ Error fetching appointments:', error.message);
        next(error);
    }
});

// ============================================
// CANCEL AN APPOINTMENT
// PUT /api/appointments/:id/cancel
// ============================================
router.put('/:id/cancel', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        console.log(`🚫 Cancelling appointment ${id} for user ${userId}`);

        // Check if appointment belongs to user
        const appointment = await getOne(
            'SELECT id, status FROM appointments WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (!appointment.data) {
            return errorResponse(res, 'Appointment not found', 404);
        }

        if (appointment.data.status === 'cancelled') {
            return errorResponse(res, 'Appointment is already cancelled', 400);
        }

        if (appointment.data.status === 'completed') {
            return errorResponse(res, 'Cannot cancel completed appointment', 400);
        }

        // Update appointment status
        const result = await update(
            'UPDATE appointments SET status = ? WHERE id = ?',
            ['cancelled', id]
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to cancel appointment', 500);
        }

        console.log(`✅ Appointment ${id} cancelled successfully`);
        return successResponse(res, { appointmentId: id, status: 'cancelled' }, 'Appointment cancelled successfully');

    } catch (error) {
        console.error('❌ Error cancelling appointment:', error.message);
        next(error);
    }
});

// ============================================
// GET ALL APPOINTMENTS (Admin only - for future use)
// GET /api/appointments?limit=10
// ============================================
router.get('/', async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;

        const appointments = await executeQuery(
            `SELECT id, user_id, counselor_id, appointment_date, appointment_time, status, created_at 
             FROM appointments 
             ORDER BY created_at DESC 
             LIMIT ?`,
            [parseInt(limit)]
        );

        return successResponse(res, appointments.data, 'Appointments retrieved successfully');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
