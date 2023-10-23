import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonAccountCard() {
    return (
        <>
            <Card>
                <CardContent className="space-y-2 p-5">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </CardContent>
            </Card>
        </>
    )
}