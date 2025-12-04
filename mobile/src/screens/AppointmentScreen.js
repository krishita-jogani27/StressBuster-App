// Appointment Screen
// Counselor booking system
// Author: StressBuster Team

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import colors from '../constants/colors';
import { appointmentAPI } from '../services/api';

const AppointmentScreen = () => {
    const [counselors, setCounselors] = useState([]);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        loadCounselors();
    }, []);

    const loadCounselors = async () => {
        try {
            const response = await appointmentAPI.getCounselors();
            setCounselors(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load counselors');
        } finally {
            setLoading(false);
        }
    };

    const selectCounselor = async (counselor) => {
        setSelectedCounselor(counselor);
        setSelectedDate(null);
        setSelectedTime(null);
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        loadAvailableSlots(counselor.id, dateStr);
    };

    const loadAvailableSlots = async (counselorId, date) => {
        try {
            const response = await appointmentAPI.getAvailableSlots(counselorId, date);
            setAvailableSlots(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load available slots');
        }
    };

    const bookAppointment = async () => {
        if (!selectedCounselor || !selectedDate || !selectedTime) {
            Alert.alert('Error', 'Please select counselor, date, and time');
            return;
        }

        setBookingLoading(true);
        try {
            await appointmentAPI.bookAppointment({
                counselorId: selectedCounselor.id,
                appointmentDate: selectedDate,
                appointmentTime: selectedTime,
                isAnonymous: false,
            });
            Alert.alert('Success', 'Appointment booked successfully!');
            setSelectedCounselor(null);
            setSelectedDate(null);
            setSelectedTime(null);
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to book appointment');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return <Loading message="Loading counselors..." />;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Counselor Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select a Counselor</Text>
                {counselors.map((counselor) => (
                    <TouchableOpacity
                        key={counselor.id}
                        onPress={() => selectCounselor(counselor)}
                    >
                        <Card style={[
                            styles.counselorCard,
                            selectedCounselor?.id === counselor.id && styles.selectedCard
                        ]}>
                            <View style={styles.counselorHeader}>
                                <Text style={styles.counselorName}>{counselor.name}</Text>
                                <View style={styles.ratingContainer}>
                                    <Icon name="star" size={16} color={colors.accent} />
                                    <Text style={styles.rating}>{counselor.rating}</Text>
                                </View>
                            </View>
                            <Text style={styles.specialization}>{counselor.specialization}</Text>
                            <Text style={styles.qualification}>{counselor.qualification}</Text>
                            <Text style={styles.experience}>{counselor.experience_years} years experience</Text>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Time Slot Selection */}
            {selectedCounselor && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Time Slots</Text>
                    <Text style={styles.dateText}>Date: {selectedDate}</Text>
                    <View style={styles.slotsContainer}>
                        {availableSlots.map((slot, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.slotButton,
                                    selectedTime === slot && styles.selectedSlot
                                ]}
                                onPress={() => setSelectedTime(slot)}
                            >
                                <Text style={[
                                    styles.slotText,
                                    selectedTime === slot && styles.selectedSlotText
                                ]}>
                                    {slot.substring(0, 5)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Book Button */}
            {selectedCounselor && selectedTime && (
                <View style={styles.section}>
                    <Button
                        title="Book Appointment"
                        onPress={bookAppointment}
                        loading={bookingLoading}
                    />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    counselorCard: {
        marginBottom: 12,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: colors.primary,
    },
    counselorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    counselorName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginLeft: 4,
    },
    specialization: {
        fontSize: 15,
        color: colors.primary,
        marginBottom: 4,
    },
    qualification: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    experience: {
        fontSize: 13,
        color: colors.textLight,
    },
    dateText: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 12,
    },
    slotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    slotButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    selectedSlot: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    slotText: {
        fontSize: 15,
        color: colors.text,
    },
    selectedSlotText: {
        color: colors.textInverse,
        fontWeight: '600',
    },
});

export default AppointmentScreen;
