import { NextResponse } from "next/server"

const symbols = [
  { symbol: 'XBT', description: 'Bitcoin' },
  { symbol: 'ETH', description: 'Ethereum' },
  // Add more symbols as needed
];

export async function GET(request: any, {params} :any){
  const query = params.Symbolinput;
  const searchTerm = query.toLowerCase() || '';
  
  const filteredSymbols = symbols.filter((s) =>
    s.symbol.toLowerCase().includes(searchTerm)
);
  // console.log(filteredSymbols);
  return NextResponse.json(filteredSymbols);
  // return NextResponse.json({msg: "lla"});
};

