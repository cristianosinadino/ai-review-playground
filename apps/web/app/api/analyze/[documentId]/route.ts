import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ message: 'Playground stub — no real analysis' }, { status: 200 })
}
