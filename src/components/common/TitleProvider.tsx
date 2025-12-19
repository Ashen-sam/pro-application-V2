import { useMatches } from "react-router-dom";

export default function TitleProvider() {
    const matches = useMatches();

    const match = matches
        .slice()
        .reverse()
        .find((m) => (m.handle as { title?: string })?.title);

    if (match) {
        document.title = `Ashen sam › ${(match.handle as { title?: string }).title}`;
    }

    return null;
}
