import { useHistory } from "react-router-dom";
import { deleteTableReservation } from "../utils/api";

// Defines the 'finish' table button function

function FinishTable({ table_id }) {
	const history = useHistory();

	// click handler
	async function finishHandler(e) {
		e.preventDefault();
		const abortController = new AbortController();

		// after clicking the 'Finish' button, user is prompted with dialog
		const finishTable = window.confirm(
			"Is this table ready to seat new guests? This cannot be undone."
		);

		if (!finishTable) return history.push("/dashboard");

		// deletes table reservation
		try {
			await deleteTableReservation(table_id, abortController.signal);
		} catch (error) {
			console.log(error.message);
		}

		window.location.reload();

		return () => abortController.abort();
	}

	return (
		<button
			type="button"
			className="btn btn-success"
			data-table-id-finish={table_id}
			onClick={(e) => finishHandler(e)}
		>
			Finish
		</button>
	);
}

export default FinishTable;
