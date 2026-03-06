export async function fetchHtml(url: string): Promise<string> {
  const response = await fetch('http://localhost:3001/api/fetch-html', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Ошибка получения HTML');
  }

  return data.html;
}