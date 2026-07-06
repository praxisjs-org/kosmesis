import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  DataTable,
  DataTablePagination,
  DataTableState,
  type DataTableColumn,
} from "@/ui/tailwind/data-table";

interface Invoice {
  id: string;
  status: "paid" | "pending" | "unpaid";
  method: string;
  amount: number;
}

const invoices: Invoice[] = Array.from({ length: 24 }, (_, i) => ({
  id: `INV${String(i + 1).padStart(3, "0")}`,
  status: (["paid", "pending", "unpaid"] as const)[i % 3],
  method: ["Credit Card", "PayPal", "Bank Transfer"][i % 3],
  amount: 50 + i * 12.5,
}));

const columns: Array<DataTableColumn<Invoice>> = [
  { key: "id", header: "Invoice", sortable: true },
  { key: "status", header: "Status", sortable: true },
  { key: "method", header: "Method" },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    sortable: true,
    cell: (row) => `$${row.amount.toFixed(2)}`,
  },
];

const meta: Meta = {
  title: "Tailwind/DataTable",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational + a small table-model helper — no Morphos equivalent, and " +
          "deliberately no `@tanstack/table`-style dependency: `DataTableState` owns sorting and " +
          "pagination as plain arrays/indices, computed on read. `DataTableState` is a pure state " +
          "container (`render()` returns `null`), instantiated directly and passed to `DataTable`/" +
          "`DataTablePagination` via the `state` prop. Composes `Table` under the hood.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() state = new DataTableState<Invoice>({ data: invoices, columns, pageSize: 5 });

  render() {
    return (
      <div style="width:480px">
        <DataTable state={this.state} getRowKey={(row: Invoice) => row.id} />
        <DataTablePagination state={this.state} />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default (sortable + paginated)",
  render: () => <DefaultDemo />,
};
