
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  joinDate: string;
  expiryDate: string;
  memberNumber: string;
}

interface IDCardProps {
  member: Member;
  size?: 'small' | 'large';
}

const IDCard = ({ member, size = 'large' }: IDCardProps) => {
  const isSmall = size === 'small';
  
  return (
    <Card className={`${isSmall ? 'w-64 h-40' : 'w-96 h-60'} bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden`}>
      <CardContent className={`p-${isSmall ? '3' : '4'} h-full flex flex-col justify-between`}>
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className={`${isSmall ? 'text-xs' : 'text-sm'} font-bold opacity-90`}>FITTRACK PRO</h2>
              <h3 className={`${isSmall ? 'text-lg' : 'text-xl'} font-bold leading-tight`}>{member.name}</h3>
            </div>
            <div className="bg-white p-2 rounded">
              <QrCode className={`${isSmall ? 'h-8 w-8' : 'h-12 w-12'} text-blue-600`} />
            </div>
          </div>
          
          <div className={`${isSmall ? 'text-xs' : 'text-sm'} space-y-1 opacity-90`}>
            <p>Member #: {member.memberNumber}</p>
            <p>Plan: {member.plan}</p>
            <p>Valid Until: {member.expiryDate}</p>
          </div>
        </div>
        
        <div className={`${isSmall ? 'text-xs' : 'text-sm'} opacity-75`}>
          <p>Emergency: +251-911-000000</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IDCard;
