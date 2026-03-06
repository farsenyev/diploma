import type { PageSnapshot } from '../types';

export async function fetchSnapshot(url: string): Promise<PageSnapshot> {
    const response = await fetch('http://localhost:3001/api/page-snapshot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Ошибка получения snapshot');
    }

    return data;
}