function FinishTable({ table, handleFinal }) {
	if (table.reservation_id) {
		return (
			<button
				data-table-id-finish={table.table_id}
				onClick={handleFinal}
				value={table.table_id}
				className="btn btn-success"
			>
				Finish
			</button>
		);
	} else {
		return null;
	}
}

export default FinishTable;
