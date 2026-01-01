import {
	collection,
	addDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	doc,
	query,
	orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const CARDS_COLLECTION = "cards";

// Get all cards ordered by order field
export const getCards = async () => {
	const q = query(collection(db, CARDS_COLLECTION), orderBy("order", "asc"));
	const snapshot = await getDocs(q);
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a new card
export const addCard = async (cardData) => {
	const cards = await getCards();
	const maxOrder =
		cards.length > 0 ? Math.max(...cards.map((c) => c.order)) : -1;

	const newCard = {
		...cardData,
		order: maxOrder + 1,
		createdAt: new Date().toISOString(),
	};

	const docRef = await addDoc(collection(db, CARDS_COLLECTION), newCard);
	return { id: docRef.id, ...newCard };
};

// Update a card
export const updateCard = async (id, updates) => {
	const cardRef = doc(db, CARDS_COLLECTION, id);
	await updateDoc(cardRef, {
		...updates,
		updatedAt: new Date().toISOString(),
	});
};

// Delete a card
export const deleteCard = async (id) => {
	const cardRef = doc(db, CARDS_COLLECTION, id);
	await deleteDoc(cardRef);
};

// Update card order (for drag and drop)
export const updateCardOrder = async (id, newOrder) => {
	const cardRef = doc(db, CARDS_COLLECTION, id);
	await updateDoc(cardRef, { order: newOrder });
};

// Calculate new order when moving a card between two others
export const calculateNewOrder = (prevOrder, nextOrder) => {
	if (prevOrder === undefined && nextOrder === undefined) {
		return 0;
	}
	if (prevOrder === undefined) {
		return nextOrder - 1;
	}
	if (nextOrder === undefined) {
		return prevOrder + 1;
	}
	return (prevOrder + nextOrder) / 2;
};
