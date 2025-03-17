
import React from 'react';
import { Badge as BadgeType } from '@/lib/types';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Star, 
  DollarSign, 
  Shield, 
  Lightbulb, 
  Heart, 
  Rocket, 
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgesCardProps {
  badges: BadgeType[];
  className?: string;
}

const BadgesCard: React.FC<BadgesCardProps> = ({ badges, className }) => {
  const getIconForBadge = (iconName: string) => {
    switch (iconName) {
      case 'star':
        return <Star size={16} />;
      case 'money':
        return <DollarSign size={16} />;
      case 'shield':
        return <Shield size={16} />;
      case 'lightbulb':
        return <Lightbulb size={16} />;
      case 'heart':
        return <Heart size={16} />;
      case 'rocket':
        return <Rocket size={16} />;
      case 'zap':
        return <Zap size={16} />;
      default:
        return <Award size={16} />;
    }
  };

  // Add some example badges that are not earned yet
  const allBadges = [
    ...badges,
    {
      id: 'badge4',
      name: 'Innovador',
      description: 'Proponer 5 ideas de mejora aprobadas',
      earned: false,
      icon: 'lightbulb',
    },
    {
      id: 'badge5',
      name: 'Cliente Feliz',
      description: 'Obtener 10 evaluaciones de satisfacción excelentes',
      earned: false,
      icon: 'heart',
    },
    {
      id: 'badge6',
      name: 'Velocista',
      description: 'Completar 20 contratos en un día',
      earned: false,
      icon: 'zap',
    },
  ];

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award size={18} className="text-primary" />
          Insignias
        </CardTitle>
        <CardDescription>Reconocimientos por tu desempeño</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {allBadges.map((badge) => (
            <div 
              key={badge.id} 
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                badge.earned 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-secondary/10 border-secondary/30 opacity-60"
              )}
            >
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  badge.earned 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {getIconForBadge(badge.icon)}
              </div>
              <div>
                <div className="font-medium text-sm flex items-center gap-2">
                  {badge.name}
                  {badge.earned && (
                    <Badge variant="outline" className="text-[10px] py-0 h-4">
                      Conseguido
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {badge.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesCard;
