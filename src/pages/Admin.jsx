import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
	getCards,
	addCard,
	updateCard,
	deleteCard,
	updateCardOrder,
	calculateNewOrder,
} from "@/services/cardService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableCard({ card, onEdit, onDelete }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: card.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className='mb-3'>
			<Card>
				<CardContent className='p-4'>
					<div className='flex items-start gap-3'>
						<div
							{...attributes}
							{...listeners}
							className='cursor-grab active:cursor-grabbing mt-1 text-gray-400 hover:text-gray-600'
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path d='M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z' />
							</svg>
						</div>
						<div className='flex-1 min-w-0'>
							<h3 className='font-semibold truncate'>{card.title}</h3>
							<p className='text-sm text-gray-600 line-clamp-2'>
								{card.description}
							</p>
							<p className='text-xs text-gray-400 mt-1 truncate'>{card.link}</p>
						</div>
						<div className='flex gap-2'>
							<Button size='sm' variant='outline' onClick={() => onEdit(card)}>
								Edit
							</Button>
							<Button
								size='sm'
								variant='destructive'
								onClick={() => onDelete(card.id)}
							>
								Delete
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function Admin() {
	const navigate = useNavigate();
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingCard, setEditingCard] = useState(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		link: "",
	});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	useEffect(() => {
		loadCards();
	}, []);

	const loadCards = async () => {
		try {
			const data = await getCards();
			setCards(data);
		} catch (error) {
			console.error("Error loading cards:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigate("/login");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingCard) {
				await updateCard(editingCard.id, formData);
			} else {
				await addCard(formData);
			}
			setFormData({ title: "", description: "", link: "" });
			setEditingCard(null);
			await loadCards();
		} catch (error) {
			console.error("Error saving card:", error);
		}
	};

	const handleEdit = (card) => {
		setEditingCard(card);
		setFormData({
			title: card.title,
			description: card.description,
			link: card.link,
		});
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this card?")) {
			try {
				await deleteCard(id);
				await loadCards();
			} catch (error) {
				console.error("Error deleting card:", error);
			}
		}
	};

	const handleDragEnd = async (event) => {
		const { active, over } = event;

		if (active.id !== over.id) {
			const oldIndex = cards.findIndex((c) => c.id === active.id);
			const newIndex = cards.findIndex((c) => c.id === over.id);

			const reorderedCards = arrayMove(cards, oldIndex, newIndex);
			setCards(reorderedCards);

			try {
				const prevOrder = reorderedCards[newIndex - 1]?.order;
				const nextOrder = reorderedCards[newIndex + 1]?.order;
				const newOrder = calculateNewOrder(prevOrder, nextOrder);

				await updateCardOrder(active.id, newOrder);
				await loadCards();
			} catch (error) {
				console.error("Error updating card order:", error);
				setCards(cards);
			}
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-lg'>Loading...</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-4xl mx-auto'>
				<div className='flex justify-between items-center mb-8'>
					<h1 className='text-3xl font-bold text-gray-900'>Admin Panel</h1>
					<div className='flex gap-3'>
						<Button variant='outline' onClick={() => navigate("/")}>
							View Site
						</Button>
						<Button variant='outline' onClick={handleLogout}>
							Logout
						</Button>
					</div>
				</div>

				<Card className='mb-8'>
					<CardHeader>
						<CardTitle>{editingCard ? "Edit Card" : "Add New Card"}</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='title'>Title</Label>
								<Input
									id='title'
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									required
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='description'>Description</Label>
								<Input
									id='description'
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									required
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='link'>Link</Label>
								<Input
									id='link'
									type='url'
									value={formData.link}
									onChange={(e) =>
										setFormData({ ...formData, link: e.target.value })
									}
									required
								/>
							</div>
							<div className='flex gap-2'>
								<Button type='submit'>
									{editingCard ? "Update Card" : "Add Card"}
								</Button>
								{editingCard && (
									<Button
										type='button'
										variant='outline'
										onClick={() => {
											setEditingCard(null);
											setFormData({ title: "", description: "", link: "" });
										}}
									>
										Cancel
									</Button>
								)}
							</div>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Cards ({cards.length})</CardTitle>
					</CardHeader>
					<CardContent>
						{cards.length === 0 ? (
							<p className='text-gray-500 text-center py-8'>
								No cards yet. Add one above!
							</p>
						) : (
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={cards}
									strategy={verticalListSortingStrategy}
								>
									{cards.map((card) => (
										<SortableCard
											key={card.id}
											card={card}
											onEdit={handleEdit}
											onDelete={handleDelete}
										/>
									))}
								</SortableContext>
							</DndContext>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
