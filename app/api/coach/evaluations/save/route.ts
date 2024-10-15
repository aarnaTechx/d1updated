// app/api/evaluation/save/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db'; // Import your Drizzle ORM database instance
import { evaluationResults, playerEvaluation } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server'; // Import NextRequest

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const data = await req.json();
        const { 
            evaluationId, 
            playerId, 
            coachId, 
            technicalScores, 
            tacticalScores, 
            physicalScores, 
            technicalRemarks, 
            tacticalRemarks, 
            physicalRemarks, 
            finalRemarks 
        } = data;

    

        const insertedData = await db.insert(evaluationResults).values({
            evaluationId: evaluationId,
            playerId: playerId,
            coachId: coachId,
            technicalScores: technicalScores,
            tacticalScores: tacticalScores,
            physicalScores: physicalScores,
            technicalRemarks: technicalRemarks,
            tacticalRemarks: tacticalRemarks,
            physicalRemarks: physicalRemarks,
            finalRemarks: finalRemarks,
          }).returning();

        // Update the player evaluation status
        const updateEvaluation = await db
            .update(playerEvaluation)
            .set({
                status: 2 // Assuming 2 means "completed" or some status
            })
            .where(eq(playerEvaluation.id, evaluationId)) // Update by evaluation ID
            .returning();

        // Return a success response
        return NextResponse.json({ success: "success", insertedData, updateEvaluation });
    } catch (error) {
        console.error('Error saving evaluation results:', error);
        return NextResponse.json({ success: false, error: "Error in inserting data" }, { status: 500 });
    }
}
