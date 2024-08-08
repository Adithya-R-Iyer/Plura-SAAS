import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { Contact, SubAccount, Ticket } from "@prisma/client";
import React from "react";
import { format } from "date-fns/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CreateContactBtn from "./_components/createContact-btn";

type Props = {
  params: {
    subAccountId: string;
  };
};

const ContactPage = async ({ params }: Props) => {
  type SubAccountWithContacts = SubAccount & {
    Contact: (Contact & { Ticket: Ticket[] })[];
  };

  const contacts = (await db.subAccount.findUnique({
    where: {
      id: params.subAccountId,
    },
    include: {
      Contact: {
        include: {
          Ticket: {
            select: {
              value: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })) as SubAccountWithContacts;

  const allContacts = contacts.Contact;

  const formatTotal = (tickets: Ticket[]) => {
    if (!tickets || !tickets.length)
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(0.0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(
      tickets.reduce((sum, ticket) => sum + (Number(ticket.value) || 0), 0)
    );
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl p-4">Contacts</h1>
      <CreateContactBtn subAccountId={params.subAccountId} className="self-end mb-2 -mt-2" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[200px]">Email</TableHead>
            <TableHead className="w-[200px]">Active</TableHead>
            <TableHead className="w-[200px]">Created Date</TableHead>
            <TableHead className="w-[200px]">Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="w-[200px]">
                <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback className="bg-primary text-white">
                    {contact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="w-[200px]">{contact.email}</TableCell>
              <TableCell className="w-[200px]">
                {formatTotal(contact.Ticket) ===
                new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(0.0) ? (
                  <Badge variant="destructive">Inactive</Badge>
                ) : (
                  <Badge className="bg-emerald-700">Active</Badge>
                )}
              </TableCell>
              <TableCell className="w-[200px]">{format(contact.createdAt, "MM/dd/yyyy")}</TableCell>
              <TableCell className="w-[200px]">
                {formatTotal(contact.Ticket)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactPage;
