import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SocketProvider } from '@/context/SocketContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ChatLayout from '@/pages/ChatLayout';
import Chat from '@/pages/Chat';
import ChatWelcome from '@/pages/ChatWelcome';
import ThemeSync from '@/components/ThemeSync';
import ForceAuthTheme from '@/components/ForceAuthTheme';

function App() {
    return (
        <HelmetProvider>
            <ThemeProvider>
                <AuthProvider>
                    <SocketProvider>
                        <Router>
                            <ThemeSync />
                            <ForceAuthTheme />
                        <div className="App">
                            <Routes>
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route
                                    path="/chat"
                                    element={
                                        <ProtectedRoute>
                                            <ChatLayout />
                                        </ProtectedRoute>
                                    }
                                >
                                    <Route index element={<ChatWelcome />} />
                                    <Route path=":conversationId" element={<Chat />} />
                                </Route>

                                <Route path="/" element={<Navigate to="/chat" replace />} />

                                <Route path="*" element={<Navigate to="/chat" replace />} />
                            </Routes>

                            <Toaster
                                position="top-right"
                            />
                        </div>
                        </Router>
                    </SocketProvider>
                </AuthProvider>
            </ThemeProvider>
        </HelmetProvider>
    );
}

export default App;
