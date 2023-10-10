import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return get(res);
  } else if (req.method === "POST") {
    return post(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

function get(res: NextApiResponse) {
  res.status(200).json({
    label: "Store Name",
    icon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
  });
}
async function post(req: PublicKey, res: PublicKey) {
  const { account, reference } = req.body;

  const connection = new Connection(clusterApiUrl("devnet"));

  const { blockhash } = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: account,
  });

  const instruction = SystemProgram.transfer({
    fromPubkey: account,
    toPubkey: Keypair.generate().publicKey,
    lamports: 0.001 * LAMPORTS_PER_SOL,
  });

  transaction.add(instruction);

  transaction.keys.push({
    pubkey: reference,
    isSigner: false,
    isWritable: false,
  });

  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });
  const base64 = serializedTransaction.toString("base64");

  const message = "Simple transfer of 0.001 SOL";

  res.send(200).json({
    transaction: base64,
    message,
  });
}
