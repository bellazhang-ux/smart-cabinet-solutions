import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LOGIN_CREDENTIALS } from '@/data/mock';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-lg border shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-mono text-foreground">Smart Cabinet</h1>
            <p className="text-muted-foreground text-sm mt-1">Intelligent Locker Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full gradient-primary">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Demo accounts:</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(LOGIN_CREDENTIALS).map(([user, { role }]) => (
                <button
                  key={user}
                  onClick={() => { setUsername(user); setPassword(LOGIN_CREDENTIALS[user].password); }}
                  className="text-xs text-left px-2 py-1 rounded hover:bg-muted transition-colors"
                >
                  <span className="font-mono text-primary">{user}</span>
                  <span className="text-muted-foreground ml-1">({role})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
