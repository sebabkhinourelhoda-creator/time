import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ParticlesBg } from '@/components/ParticlesBg';
import { DNAIcon, PulseIcon, CellIcon, MicroscopeIcon } from '@/components/MedicalIcons';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(email, password, name);
        toast({
          title: 'Registration successful',
          description: 'Welcome to Time2Thrive Health!',
        });
      } else {
        await login(email, password);
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background with gradient and noise */}
      <div 
        className="absolute inset-0 bg-background"
        style={{
          backgroundImage: `
            linear-gradient(to bottom right, 
              rgba(109, 40, 217, 0.08) 0%, 
              rgba(147, 51, 234, 0.08) 50%,
              rgba(79, 70, 229, 0.08) 100%
            )
          `
        }}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-50" />
      
      {/* Decorative Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Large Half Circles */}
        <div className="absolute -left-1/4 top-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 w-1/2 h-1/2 bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-3xl" />
        
        {/* DNA Strands with Animation */}
        <motion.div
          initial={{ rotate: -45, scale: 0.9 }}
          animate={{ rotate: -35, scale: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -left-4 top-1/4 w-32 h-32 text-primary/30"
        >
          <DNAIcon />
        </motion.div>
        <motion.div
          initial={{ rotate: 45, scale: 0.9 }}
          animate={{ rotate: 35, scale: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -right-4 bottom-1/4 w-32 h-32 text-secondary/30"
        >
          <DNAIcon />
        </motion.div>
        
        {/* Floating Cells */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-10, 10] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute left-1/4 top-20 w-20 h-20 text-primary/20"
        >
          <CellIcon />
        </motion.div>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [10, -10] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute right-1/4 bottom-20 w-20 h-20 text-secondary/20"
        >
          <CellIcon />
        </motion.div>
        
        {/* Rotating Microscope */}
        <motion.div
          initial={{ rotate: 12, scale: 0.9 }}
          animate={{ rotate: -12, scale: 1.1 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute left-10 bottom-10 w-24 h-24 text-primary/30"
        >
          <MicroscopeIcon />
        </motion.div>
        
        {/* Animated Pulse Lines */}
        <motion.div
          initial={{ opacity: 0.2, scale: 0.9 }}
          animate={{ opacity: 0.4, scale: 1.1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute right-10 top-20 w-40 h-16 text-secondary/30"
        >
          <PulseIcon />
        </motion.div>

        {/* Additional Decorative Elements */}
        <div className="absolute left-1/3 top-1/4 w-32 h-32 rounded-full border-4 border-primary/10 transform rotate-45" />
        <div className="absolute right-1/3 bottom-1/4 w-32 h-32 rounded-full border-4 border-secondary/10 transform -rotate-45" />
        
        {/* Small Circles */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute left-1/4 bottom-1/4 w-4 h-4 rounded-full bg-primary/30"
        />
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 0.8 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute right-1/4 top-1/4 w-4 h-4 rounded-full bg-secondary/30"
        />
      </div>
      
      {/* Animated Background Blobs */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.3 }}
        animate={{ scale: 1.2, opacity: 0.5 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ scale: 1.2, opacity: 0.3 }}
        animate={{ scale: 0.8, opacity: 0.5 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-tl from-secondary/20 to-primary/10 rounded-full blur-3xl"
      />
      
      {/* Logo and Title */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center space-y-4 relative"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto relative">
            <span className="text-white font-bold text-4xl">T2T</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Time2Thrive Health
        </h1>
        <p className="text-muted-foreground max-w-sm mx-auto text-base md:text-lg px-4">
          Join our community of healthcare professionals and contribute to cancer research and prevention.
        </p>
      </motion.div>

      {/* Particles */}
      <ParticlesBg />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md relative"
      >
        <Card className="border-2 shadow-2xl bg-background/80 backdrop-blur-sm relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-lg" />
          <CardHeader className="space-y-1 relative">
            <CardTitle className="text-xl md:text-2xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </CardTitle>
            <CardDescription className="text-center">
              {isRegister
                ? 'Join us in making healthcare knowledge accessible'
                : 'Access your documents and contributions'}
            </CardDescription>
          </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 relative">
            <div className="absolute right-0 top-0 w-32 h-32 text-primary/5 transform rotate-12 pointer-events-none">
              <CellIcon />
            </div>
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                  className="border-2 focus:border-primary/50 transition-colors"
                />
              </motion.div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 focus:border-primary/50 transition-colors"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 relative">
            <Button 
              type="submit" 
              className="w-full text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <span className="relative">
                {isRegister ? 'Create Account' : 'Sign In'}
              </span>
            </Button>
            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsRegister(!isRegister)}
                className="text-primary hover:text-primary/90 transition-colors"
              >
                {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </Button>
            </div>
            <div className="absolute -left-6 -bottom-6 w-24 h-24 text-secondary/10 transform -rotate-12 pointer-events-none">
              <DNAIcon />
            </div>
          </CardFooter>
        </form>
        </Card>
      </motion.div>
    </div>
  );
}
