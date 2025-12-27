import { useMatches } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TitleProvider() {
    const matches = useMatches();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const fullName = user.userName || user.name || 'User';
        setUserName(fullName.split(' ')[0]);
    }, []);
    const match = matches
        .slice()
        .reverse()
        .find((m) => (m.handle as { title?: string })?.title);

    if (match) {
        document.title = `${userName} › ${(match.handle as { title?: string }).title}`;
    }

    return null;
}