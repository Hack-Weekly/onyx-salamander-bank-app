import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import clsx from "clsx";
import { TransactionHistory } from "@/server/api/routers/transaction";
import { useAccountStore } from "@/lib/store";

const formatDate = (date: Date) => {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // Get the day, month, and year
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Get the hour, minute, and second
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
};

export default function TransactionTable({
    data
} : {
    data: TransactionHistory[]
}) {
    const { current_account_id } = useAccountStore();

    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((transaction) => (
                transaction == undefined ? 
                    null :
                <TableRow
                    key={
                    transaction.timestamp.toString() +
                    transaction.to.account_id +
                    transaction.from.account_id
                    } >
                    <TableCell>
                    <div className="flex items-center gap-2">
                        Image
                        <div>
                        <p>{transaction.from.user.username}</p>
                        <p className="opacity-70 mt-1">
                            {transaction.from.account_id}
                        </p>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell>
                    {" "}
                    <div className="flex items-center gap-2">
                        Image
                        <div>
                        <p>{transaction.to.user.username}</p>
                        <p className="opacity-70 mt-1">
                            {transaction.to.account_id}
                        </p>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell>
                    <p>{formatDate(transaction.timestamp)}</p>
                    <p className="opacity-70 mt-1">
                        Status: {transaction.status.toLocaleUpperCase()}
                    </p>
                    </TableCell>
                    <TableCell
                    className={clsx(
                        "text-right",
                        transaction.from.account_id === current_account_id &&
                        "text-red-600 font-medium",
                        transaction.to.account_id === current_account_id &&
                        "text-green-600 font-medium",
                    )}
                    >
                    {transaction.from.account_id === current_account_id && "-"}
                    {transaction.to.account_id === current_account_id && "+"}$
                    {Number(transaction.amount).toFixed(2)}
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
    )
}
