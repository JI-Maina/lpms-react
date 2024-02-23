"use client";

import { useEffect, useState } from "react";

import { columns } from "./columns";
import { Property } from "@/types/property";
import { MaintenancesTable } from "./maintenances-table";
import AddUnitMaintenanceModal from "./add-unit-maintenance-modal";
import PropertyDetailsHeader from "../shared/property-details-header";

type MaintenanceProps = {
  properties: Property[];
};

const PropertyMaintenances = ({ properties }: MaintenanceProps) => {
  const [id, setId] = useState(properties[0]?.id);
  const [maintenaces, setMaintenances] = useState([]);

  const property = properties.find((property) => property.id === id);
  const units = property?.unit_set;

  const onChange = (value: string) => {
    setId(value);
  };

  useEffect(() => {
    const getMaintenances = async () => {
      const res = await fetch(`/api/maintenances/${id}`);
      const data = await res.json();
      setMaintenances(data);
    };

    if (id) getMaintenances();
  }, [id, properties]);

  return (
    <main>
      <PropertyDetailsHeader
        id={id}
        title="Maintenances Data"
        properties={properties}
        onChange={onChange}
        actionModal={units && <AddUnitMaintenanceModal units={units} />}
      />

      <div className="max-w-[360px] sm:max-w-full">
        <MaintenancesTable data={maintenaces} columns={columns} />
      </div>
    </main>
  );
};

export default PropertyMaintenances;
