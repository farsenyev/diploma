import {type FormEvent, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if (!url.trim()) return;

        navigate('/results', {
            state: { url },
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleStart();
    };

    return (
        <main className="page">
            <h1>Accessibility Checker</h1>

            <form className="input-group" onSubmit={handleSubmit}>
                <input
                    autoFocus
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button type="submit" disabled={!url.trim()}>Start</button>
            </form>
        </main>
    );
};