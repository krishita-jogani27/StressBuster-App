// Appointment Routes
// Counselor appointment booking system
// Author: StressBuster Team

const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const { executeQuery, insert, getOne } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// ============================================
// GET ALL COUNSELORS
// GET /api/appointments/counselors
// ============================================
router.get('/counselors', async (req, res, next) => {
    try {
        const result = await executeQuery(
            `SELECT id, name, specialization, qualification, experience_years, 
              available_days, available_time_start, available_time_end, rating, total_sessions
       FROM counselors 
       WHERE is_active = TRUE
       ORDER BY rating DESC`
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to fetch counselors', 500);
        }

        return successResponse(res, result.data, 'Counselors retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET AVAILABLE TIME SLOTS
// GET /api/appointments/slots/:counselorId/:date
// ============================================
router.get('/slots/:counselorId/:date', async (req, res, next) => {
    try {
        const { counselorId, date } = req.params;

        // Get counselor availability
        const counselor = await getOne(
            `SELECT available_time_start, available_time_end, available_days 
       FROM counselors WHERE id = ? AND is_active = TRUE`,
            [counselorId]
        );

        if (!counselor.data) {
            return errorResponse(res, 'Counselor not found', 404);
        }

        // Get existing appointments for the date
        const bookedSlots = await executeQuery(
            `SELECT appointment_time 
       FROM appointments 
       WHERE counselor_id = ? AND appointment_date = ? AND status != 'cancelled'`,
            [counselorId, date]
        );

        // Generate available slots (every hour)
        const availableSlots = [];
        const startHour = parseInt(counselor.data.available_time_start.split(':')[0]);
        const endHour = parseInt(counselor.data.available_time_end.split(':')[0]);

        for (let hour = startHour; hour < endHour; hour++) {
            const timeSlot = `${hour.toString().padStart(2, '0')}:00:00`;
            const isBooked = bookedSlots.data.some(slot => slot.appointment_time === timeSlot);

            if (!isBooked) {
                availableSlots.push(timeSlot);
            }
        }

        return successResponse(res, availableSlots, 'Available slots retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// BOOK APPOINTMENT
// POST /api/appointments
// ============================================
router.post('/', optionalAuth, async (req, res, next) => {
    try {
        const { counselorId, appointmentDate, appointmentTime, isAnonymous, notes } = req.body;
        const userId = req.user ? req.user.userId : null;

        if (!counselorId || !appointmentDate || !appointmentTime) {
            return errorResponse(res, 'Counselor, date, and time are required', 400);
        }

        // Check if slot is available
        const existing = await getOne(
            `SELECT id FROM appointments 
       WHERE counselor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'cancelled'`,
            [counselorId, appointmentDate, appointmentTime]
        );

        if (existing.data) {
            return errorResponse(res, 'This time slot is already booked', 409);
        }

        // Create appointment
        const result = await insert(
            `INSERT INTO appointments (user_id, counselor_id, appointment_date, appointment_time, is_anonymous, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [userId, counselorId, appointmentDate, appointmentTime, isAnonymous || false, notes || null]
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to book appointment', 500);
        }

        return successResponse(res, {
            appointmentId: result.insertId
        }, 'Appointment booked successfully', 201);

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET USER APPOINTMENTS
// GET /api/appointments/my
// ============================================
router.get('/my', authenticate, async (req, res, next) => {
    try {
        const result = await executeQuery(
            `SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.notes,
              c.name as counselor_name, c.specialization
       FROM appointments a
       JOIN counselors c ON a.counselor_id = c.id
       WHERE a.user_id = ?
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
            [req.user.userId]
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to fetch appointments', 500);
        }

        return successResponse(res, result.data, 'Appointments retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// CANCEL APPOINTMENT
// PUT /api/appointments/:id/cancel
// ============================================
router.put('/:id/cancel', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await executeQuery(
            `UPDATE appointments 
       SET status = 'cancelled' 
       WHERE id = ? AND user_id = ?`,
            [id, req.user.userId]
        );

        if (!result.success || result.affectedRows === 0) {
            return errorResponse(res, 'Failed to cancel appointment', 500);
        }

        return successResponse(res, null, 'Appointment cancelled successfully');

    } catch (error) {
        next(error);
    }
});

module.exports = router;
