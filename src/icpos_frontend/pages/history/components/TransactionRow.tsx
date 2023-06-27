import { Link } from "@tanstack/router";
import { shortenPrincipal } from "../../../utils/shortenPrincipal";
import { useAuth } from "../../../auth/hooks/useAuth";
import { Transaction } from "../../../icrc/types/Transaction";

export default function TransactionRow({
  transaction,
}: {
  transaction: Transaction;
}) {
  const { identity } = useAuth();
  if (!identity) return null;

  //const principal = identity.getPrincipal().toString();
  const principal =
    "237zc-vao7e-qxrtp-dampy-4rqvq-3eg3b-elvly-q2xnl-jqlpj-d2jpt-xqe";
  const { from_account, amount, timestamp, index } = transaction;

  const displayAmount = from_account === principal ? "-" + amount : amount;
  const displayDate = new Date(timestamp / 1e6).toISOString().slice(0, 10);
  const displayFromAccount = shortenPrincipal(from_account);

  return (
    <Link
      to={"/transaction/$transactionId"}
      params={{
        transactionId: index.toString(),
      }}
      className="block w-full px-2 py-2 no-underline border-b border-gray-200 hover:bg-gray-100"
    >
      <div className="flex flex-row items-center justify-between w-full">
        <div>
          <div className="text-[0.8rem]">{displayDate}</div>
          <div>{displayFromAccount}</div>
        </div>
        <div className="text-[1.4rem]">{displayAmount}</div>
      </div>
    </Link>
  );
}