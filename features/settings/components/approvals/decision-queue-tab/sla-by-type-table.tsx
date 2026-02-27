"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  useDefaultRouting,
  useUpdateDefaultRouting,
} from "@/features/settings/hooks/use-decision-queue";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export function SLAByTypeTable() {
  const updateRefs = useRef<{ [key: string]: number }>({});

  const { data: defaultRouting } = useDefaultRouting();
  const { mutate: updateDefaultRouting, isPending: isUpdatingDefaultRouting } =
    useUpdateDefaultRouting();

  const handleChange = (id: string, sla: number) => {
    updateRefs.current[id] = sla;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.entries(updateRefs.current).map(([id, sla]) => ({ id, sla }));
    if (data.length === 0) {
      return;
    }
    
    updateDefaultRouting(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="h-80">
        <Table>
          <TableBody>
            {defaultRouting?.data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="flex flex-col gap-0.5 max-w-48">
                  <span className="text-sm font-medium truncate">
                    {item.type}
                  </span>
                  <span className="text-[10px] text-white/40 truncate">
                    → {item.destination ?? "--"}
                  </span>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={item.sla ?? 0}
                    onChange={(e) =>
                      handleChange(item.id, Number(e.target.value))
                    }
                    className="w-20 text-center"
                    min="1"
                    max="100"
                    step="1"
                  />
                  <span className="text-[14px] text-white/40 truncate ml-2">hrs</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex justify-end mt-3">
        <Button
          className="self-end text-sm font-medium"
          disabled={isUpdatingDefaultRouting}
          type="submit"
        >
          {isUpdatingDefaultRouting ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}
