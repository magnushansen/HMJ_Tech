'use client';

import { useState } from 'react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Simple validation
        if (!formData.username || !formData.email || !formData.password) {
        setError('All fields are required!');
        return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Invalid email format!');
        return;
        }

        try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Failed to sign up.');
        }

            setSuccess('Signup successful!');
            setFormData({ username: '', email: '', password: '' }); // Clear form
        } catch (err) {
            setError('Error signing up. Please try again.');
        }
    };
    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>

            {/** Name input */}
            <div>
                <label>
                    Name: 
                    <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter your name">
                    </input>
                </label>
            </div>

            {/** Email input */}
            <div>
                <label>
                    Email:
                    <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email">
                    </input>
                </label>
            </div>

            {/** Password input */}
            <div>
                <label>
                    Password:
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password">
                    </input>
                </label>
            </div>

            {/** Submit button */}
            <button
            type="submit">Sign up</button>
        </form>
        </div>
    );
}

export default Signup;