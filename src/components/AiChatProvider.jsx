'use client';
import { useRouter } from 'next/navigation';
import AiGlobalInput from './AiGlobalInput';

const AiChatProvider = () => {
    const router = useRouter();

    const handleAskAI = (prompt) => {
        router.push(`/contactme?openAI=1&prompt=${encodeURIComponent(prompt)}`);
    };

    return <AiGlobalInput onAskAI={handleAskAI} />;
};

export default AiChatProvider;
