import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { useAccountStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

export default function TransactionTable() {
  const { data: transactions, isLoading } =
    api.transaction.getTransactionsHistory.useQuery();
  const { current_account_id } = useAccountStore();

  return (
    <>
      {transactions && transactions.length === 0 ? (
        "No transactions"
      ) : (
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
            {!transactions || isLoading ? (
              Array(4)
                .fill(0)
                .map(() => (
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full " />
                        <div>
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="mt-1 h-4 w-36" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full " />
                        <div>
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="mt-1 h-4 w-36" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="mt-1 h-4 w-36" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <>
                {transactions.map((transaction) =>
                  transaction == undefined ? null : (
                    <TableRow
                      key={
                        transaction.timestamp.toString() +
                        transaction.to.account_id +
                        transaction.from.account_id
                      }
                    >
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={transaction.from.user.imageUrl}
                              alt={transaction.from.user.username ?? ""}
                            />
                            <AvatarFallback>
                              {transaction.from.user.username ?? ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{transaction.from.user.username}</p>
                            <p className="mt-1 opacity-70">
                              {transaction.from.account_id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={transaction.to.user.imageUrl}
                              alt={transaction.to.user.username ?? ""}
                            />
                            <AvatarFallback>
                              {transaction.to.user.username ?? ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{transaction.to.user.username}</p>
                            <p className="mt-1 opacity-70">
                              {transaction.to.account_id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{formatDate(transaction.timestamp)}</p>
                        <p className="mt-1 opacity-70">
                          Status: {transaction.status.toLocaleUpperCase()}
                        </p>
                      </TableCell>
                      <TableCell
                        className={clsx(
                          "text-right",
                          transaction.from.account_id === current_account_id &&
                            "font-medium text-red-600",
                          transaction.to.account_id === current_account_id &&
                            "font-medium text-green-600",
                        )}
                      >
                        {transaction.from.account_id === current_account_id &&
                          "-"}
                        {transaction.to.account_id === current_account_id &&
                          "+"}
                        ${Number(transaction.amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}
