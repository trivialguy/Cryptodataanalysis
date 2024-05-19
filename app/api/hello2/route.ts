import { NextResponse } from "next/server"

export async function GET(request: any, { params } :any) {
  const symbol = params.symbol; 
  const granularity = '1d'; 
  const endTime = new Date();
  const startTime = new Date(endTime);
  startTime.setDate(endTime.getDate() - 30);

  const startTimeISO = startTime.toISOString();
  const endTimeISO = endTime.toISOString();

  const url = `https://www.bitmex.com/api/v1/trade/bucketed?symbol=${symbol}&binSize=${granularity}&startTime=${startTimeISO}&endTime=${endTimeISO}&count=30`;

  console.log(url);
  const response=await fetch(url);
  const data = await response.json();
  console.log(typeof(data));
  return NextResponse.json(data)
}
