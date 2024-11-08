async function queryDB(statement) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: statement,
                password: 'E6fPh9',
                url: 'https://www.coursera.org/learn/-security-principles/assignment-submission/OWkDc/self-check-security-concepts/'
            }),
            signal: AbortSignal.timeout(3000)
        });
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            console.error(`DB HTTP error! status: ${response.status}`, data);
        } else if (data.answer) {
            console.log(await JSON.parse(data.answer));
        } else {
            console.log("No answer found");
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

queryDB('5Ensuring timely and reliable access to and use of information by authorized users. ')
