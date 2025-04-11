async function addMood() {
    const input = document.getElementById('moodInput');
    const list = document.getElementById('moodList');
    const mood = input.value.trim();

    if (!mood) {
        alert("Please enter a mood.");
        return;
    }

    const response = await fetch('https://cors-anywhere.herokuapp.com/https://sentim-api.onrender.com/api/v1/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ text: mood })
    });

    const rawText = await response.text();
    const data = JSON.parse(rawText);
    const sentiment = data.result.type;

    const entry = document.createElement('div');
    entry.textContent = `${new Date().toLocaleString()}: ${mood} — [${sentiment}]`;

    if (sentiment === 'positive') entry.style.color = 'green';
    else if (sentiment === 'negative') entry.style.color = 'red';
    else entry.style.color = 'gray';

    list.appendChild(entry);
    input.value = '';

    // Save to localStorage
    const moodEntry = {
        mood: mood,
        sentiment: sentiment,
        timestamp: new Date().toLocaleString()
    };

    const storedMoods = JSON.parse(localStorage.getItem("moods")) || [];
    storedMoods.push(moodEntry);
    localStorage.setItem("moods", JSON.stringify(storedMoods));

    // Update mood stats
    updateMoodStats();
}

function updateMoodStats() {
    const storedMoods = JSON.parse(localStorage.getItem("moods")) || [];

    let positive = 0;
    let negative = 0;
    let neutral = 0;

    storedMoods.forEach(entry => {
        if (entry.sentiment === 'positive') positive++;
        else if (entry.sentiment === 'negative') negative++;
        else neutral++;
    });

    const stats = `✅ Positive: ${positive} — ❌ Negative: ${negative} — 😐 Neutral: ${neutral}`;
    document.getElementById('moodStats').textContent = stats;
}

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('moodList');
    const storedMoods = JSON.parse(localStorage.getItem("moods")) || [];

    storedMoods.forEach(entry => {
        const div = document.createElement('div');
        div.textContent = `${entry.timestamp}: ${entry.mood} — [${entry.sentiment}]`;

        if (entry.sentiment === 'positive') div.style.color = 'green';
        else if (entry.sentiment === 'negative') div.style.color = 'red';
        else div.style.color = 'gray';

        list.appendChild(div);
    });

    updateMoodStats(); // Show stats on page load
});
