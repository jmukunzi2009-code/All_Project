import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { School } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <School className="size-24 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-6xl mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    </div>
  );
}
