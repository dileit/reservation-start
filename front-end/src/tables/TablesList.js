import React from "react";
import FinishTable from "./FinishTable";

const TablesList = ({ tables = [] }) => {
	// only display if present
	if (tables.length > 0) {
		return (
			<div className="row">
				{tables.map((table) => (
					<div className="col-sm-6" key={table.table_id}>
						<div className="card text-white bg-dark mb-3">
							<div className="card-body">
								<h5 className="card-title">{table.table_name}</h5>
								<p className="card-text">
									Table Capacity: {table.capacity} <br /> Status:{" "}
									<span data-table-id-status={table.table_id}>
										{table.reservation_id ? "occupied" : "free"}
									</span>
									<br />
									<br />
									{table.reservation_id && (
										<FinishTable table_id={table.table_id} />
									)}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	} else {
		return (
			<div className="alert alert-warning" role="alert">
				There are no tables saved!
			</div>
		);
	}
};

export default TablesList;
