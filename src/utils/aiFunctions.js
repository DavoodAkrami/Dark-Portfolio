

export const functionsDefinitions = [
    {
        type: "function",
        name: "send_email_to_davood",
        description: "Send an email to Davood, Use this when user ask you to send an email or contact him",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "sender's name",
                },
                email: {
                    type: "string",
                    description: "sender's email",
                },
                message: {
                    type: "string",
                    description: "sender's message",
                }
            },
            required: ["name", "email", "message"]
        }
    },
];

export const executeFunction = async (functionName, parameters) => {

    const args = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;


    try{
        switch(functionName) {
            case "send_email_to_davood":

            if (!args.name || typeof args.name !== 'string') {
                return { error: "Name is required and must be a string" };
            }
            if (!args.email || typeof args.email !== 'string') {
                return { error: "Email is required and must be a string" };
            }
            if (!args.message || typeof args.message !== 'string') {
                return { error: "Message is required and must be a string" };
            }

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(args.email)) {
                return { error: "Invalid email address format" };
            }

            const response = await fetch("https://formspree.io/f/mjkrnabo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: args.name,
                    email: args.email,
                    message: args.message
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { 
                  error: `Failed to send email: ${errorData.error || response.statusText}` 
                };
            }

            return {
                success: true,
                message: `Email sent successfully! Your message has been delivered to Davood. He'll get back to you soon at ${args.email}.`
            };

            default:
                return { error: `Function ${functionName} is not implemented yet.` };
        }
    } catch (error) {
        console.error(`Function execution error: ${error.message}`);
        return { error: error.message };
    }
}