import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Profile.module.css';

function Profile() {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [lastMessageCount, setLastMessageCount] = useState(0);
    const [selectedMessageIds, setSelectedMessageIds] = useState([]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:1337/api/messages`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const userMessages = data.data.map(item => ({
                id: item.id,
                details: item.attributes.message[0].children[0].text,
                expanded: false,
                read: item.attributes.read,
            }));

            setMessages(userMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const markAsRead = async (messageId) => {
        try {
            await fetch(`http://localhost:1337/api/messages/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ read: true }),
            });

            // Update the message as read in the state
            setMessages(messages.map((message) => {
                if (message.id === messageId) {
                    return { ...message, read: true };
                }
                return message;
            }));
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const deleteSelectedMessages = async () => {
        try {
            // Send requests to delete the selected messages
            await Promise.all(
                selectedMessageIds.map(async (messageId) => {
                    await fetch(`http://localhost:1337/api/messages/${messageId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                })
            );

            // Update the state to remove deleted messages
            setMessages(messages.filter((message) => !selectedMessageIds.includes(message.id)));
            setSelectedMessageIds([]); // Clear selected message IDs

            window.location.reload()
        } catch (error) {
            console.error('Error deleting messages:', error);
        }
    };

    const handleCheckboxChange = (messageId) => {
        if (selectedMessageIds.includes(messageId)) {
            // If the message ID is already selected, remove it
            setSelectedMessageIds(selectedMessageIds.filter((id) => id !== messageId));
        } else {
            // If the message ID is not selected, add it
            setSelectedMessageIds([...selectedMessageIds, messageId]);
        }
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username') || '';
        setUsername(storedUsername);

        fetchMessages();
        const interval = setInterval(fetchMessages, 100000); // Poll every 5 minutes
        return () => clearInterval(interval);
    }, []);

    // Toggle visibility of message details
    const toggleMessage = (index) => {
        const messageId = messages[index].id;
        if (!messages[index].read) {
            // If the message is unread, mark it as read when expanded
            markAsRead(messageId);
        }
        setMessages(messages.map((message, i) => {
            if (i === index) {
                return { ...message, expanded: !message.expanded };
            }
            return message;
        }));
    };

    return (
        <div className={styles.mainContent}>
            {/* <ToastContainer /> */}
            <div className={styles.pContainer}>
                <div className={styles.profileBar}>
                    <h2>My Profile</h2>
                    <p className={styles.name}>Hello, {username}</p>
                    {selectedMessageIds.length > 0 && (
                        <button onClick={deleteSelectedMessages} className={styles.deleteBtn}>
                            Delete Selected Messages
                        </button>
                    )}
                </div>
                <div className={styles.messagesContainer}>
                    {messages.map((message, index) => (
                        <div key={index} className={styles.messageBalloon}>
                            <div onClick={() => toggleMessage(index)}>
                                <p style={{ display: message.expanded ? 'none' : 'block' }} className={styles.messageTxt}>
                                    {message.expanded ? "Read message:" : "Open new message"}
                                </p>
                                {message.expanded && (
                                    <div className={styles.messageDetails}>
                                        <p>{message.details}</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedMessageIds.includes(message.id)}
                                onChange={() => handleCheckboxChange(message.id)}
                                className={styles.checkbox}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;




