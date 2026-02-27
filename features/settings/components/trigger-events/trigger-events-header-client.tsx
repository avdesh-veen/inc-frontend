
'use client';

import * as React from 'react';
import { SettingsHeader } from '@/features/settings/components/settings-header';
import { AddTriggerEventModal } from '@/features/settings/components/trigger-events/add-trigger-event-modal';

interface TriggerEventsHeaderClientProps {
  title: string;
  description: string;
}

export function TriggerEventsHeaderClient({
  title,
  description,
}: Readonly<TriggerEventsHeaderClientProps> ) {
  const [showModal, setShowModal] = React.useState(false);

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <AddTriggerEventModal
        open={showModal}
        onOpenChange={handleModalClose}
        editingEventId={null}
      />

      <SettingsHeader
        title={title}
        description={description}
        onAddClick={handleAddClick}
      />
    </>
  );
}
