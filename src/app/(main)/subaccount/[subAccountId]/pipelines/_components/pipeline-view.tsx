"use client";

import LaneForm from "@/components/forms/create-lane";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import {
  LaneDetail,
  PipelineDetailsWithLanesCardsTagsTickets,
  TicketAndTags,
} from "@/lib/types";
import { useModal } from "@/providers/model-provider";
import { Lane, Ticket } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import PipelineLane from "./pipeline-lane";
import Flag from "@/components/icons/flag";

type Props = {
  lanes: LaneDetail[];
  pipelineId: string;
  subAccountId: string;
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
  updateLanesOrder: (lanes: Lane[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
};

const PipelineView = ({
  lanes,
  pipelineId,
  subAccountId,
  pipelineDetails,
  updateLanesOrder,
  updateTicketsOrder,
}: Props) => {
  const { setOpen } = useModal();
  const router = useRouter();
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([]);

  const handleAddLane = () => {
    setOpen(
      <CustomModal
        title="Create A Lane"
        subHeading="Lanes allow you to group tickets"
      >
        <LaneForm pipelineId={pipelineId} />
      </CustomModal>
    );
  };

  useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const ticketsFromAllLanes: TicketAndTags[] = [];
  lanes.forEach((item) => {
    item.Tickets.forEach((i) => {
      ticketsFromAllLanes.push(i);
    });
  });
  const [allTickets, setAllTickets] = useState(ticketsFromAllLanes);

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source, type } = dropResult;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    switch (type) {
      case "lane": {
        const newLanes = [...allLanes]
          .toSpliced(source.index, 1)
          .toSpliced(destination.index, 0, allLanes[source.index])
          .map((lane, index) => {
            return {
              ...lane,
              order: index,
            };
          });
        setAllLanes(newLanes);
        updateLanesOrder(newLanes);
      }
      case "ticket": {
        let newLanes = [...allLanes];
        const originLane = newLanes.find(
          (lane) => lane.id === source.droppableId
        );
        const destinationLane = newLanes.find(
          (lane) => lane.id === destination.droppableId
        );

        if (!originLane || !destinationLane) {
          return;
        }

        if (source.droppableId === destination.droppableId) {
          const newOrderedTickets = [...originLane.Tickets]
            .toSpliced(source.index, 1)
            .toSpliced(destination.index, 0, originLane.Tickets[source.index])
            .map((item, idx) => {
              return { ...item, order: idx };
            });
          originLane.Tickets = newOrderedTickets;
          setAllLanes(newLanes);
          updateTicketsOrder(newOrderedTickets);
          router.refresh();
        } else {
          const [currentTicket] = originLane.Tickets.splice(source.index, 1);

          originLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx;
          });

          destinationLane.Tickets.splice(destination.index, 0, {
            ...currentTicket,
            laneId: destination.droppableId,
          });

          destinationLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx;
          });
          setAllLanes(newLanes);
          updateTicketsOrder([
            ...destinationLane.Tickets,
            ...originLane.Tickets,
          ]);
          router.refresh();
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipelineDetails?.name}</h1>
          <Button className="flex items-center gap-2" onClick={handleAddLane}>
            <Plus size={15} />
            Create Lane
          </Button>
        </div>
        <Droppable
          droppableId="lanes"
          type="lane"
          direction="horizontal"
          key="lanes"
        >
          {(provided) => (
            <div
              className="flex items-center gap-x-2 overflow-scroll"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex mt-4">
                {allLanes.map((lane, index) => (
                  <PipelineLane
                    allTickets={allTickets}
                    setAllTickets={setAllTickets}
                    subAccountId={subAccountId}
                    pipelineId={pipelineId}
                    tickets={lane.Tickets}
                    laneDetails={lane}
                    index={index}
                    key={lane.id}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
        {allLanes.length == 0 && (
          <div className="flex items-center justify-center w-full flex-col">
            <div className="opacity-100 text-muted-foreground">
              <Flag width="100%" height="100%" />
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default PipelineView;
