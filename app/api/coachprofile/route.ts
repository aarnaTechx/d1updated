import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '../../../lib/db';
import { coaches } from '../../../lib/schema'
import debug from 'debug';
import { eq } from 'drizzle-orm';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import next from 'next';
import { SECRET_KEY } from '@/lib/constants';


  export async function POST(req: NextRequest) {
    const { slug } = await req.json();
    
    try {
      // Using 'like' with lower case for case-insensitive search
      const coachlist = await db
        .select({
          firstName:coaches.firstName,
          lastName:coaches.lastName,
          id:coaches.id,
          expectedCharge:coaches.expectedCharge,
          createdAt:coaches.createdAt,
          slug:coaches.slug,
          image:coaches.image,
          rating:coaches.rating

        })
        .from(coaches)
        .where(
          eq(coaches.slug,slug)
        )
        .limit(1) 
        .execute();
        const payload = coachlist.map(coach => ({
          firstName: coach.firstName,
          lastName: coach.lastName,
          id: coach.id,
          expectedCharge: coach.expectedCharge,
          createdAt: coach.createdAt, 
          slug:coach.slug,
          rating:coach.rating,
          image: coach.image ? `${coach.image}` : null,
        }));

       
  
      return NextResponse.json(payload[0]);
    } catch (error) {
      const err = error as any;
      console.error('Error fetching coaches:', error);
      return NextResponse.json({ message: 'Failed to fetch coaches' }, { status: 500 });
    }
  }