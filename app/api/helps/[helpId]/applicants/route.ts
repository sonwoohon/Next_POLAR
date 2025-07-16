import { NextRequest, NextResponse } from 'next/server';
import { SbHelpApplicantRepository } from '@/backend/helps/infrastructures/SbHelpApplicantRepository';
import { GetHelpApplicantsUseCase } from '@/backend/helps/applications/usecases/GetHelpApplicantsUseCase';

export async function GET(
  request: NextRequest,
  { params }: { params: { helpId: string } }
) {
  try {
    const helpId = parseInt(params.helpId);
    if (!helpId) return NextResponse.json({ error: 'helpId 필요' }, { status: 400 });

    const repo = new SbHelpApplicantRepository();
    const usecase = new GetHelpApplicantsUseCase(repo);
    const result = await usecase.execute(helpId);

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
} 