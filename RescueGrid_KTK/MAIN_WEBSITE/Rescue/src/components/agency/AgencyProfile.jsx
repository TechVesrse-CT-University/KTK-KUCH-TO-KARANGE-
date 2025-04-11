import React, { useState, useEffect } from 'react';
import { getAgencyProfile, updateAgencyProfile } from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';

const AgencyProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        location: '',
        skills: '',
        resources: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getAgencyProfile();
                setProfile(data);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAgencyProfile(profile);
            alert('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">Agency Profile</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <Input
                    label="Name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                />
                <Input
                    label="Location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                />
                <Input
                    label="Skills"
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                />
                <Input
                    label="Resources"
                    name="resources"
                    value={profile.resources}
                    onChange={handleChange}
                />
                <Button type="submit">Update Profile</Button>
            </form>
        </div>
    );
};

export default AgencyProfile;