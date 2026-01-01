import { useEffect, useState } from "react";
import { getCards } from "@/services/cardService";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);

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

	const handleCardClick = (link) => {
		window.open(link, "_blank", "noopener,noreferrer");
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-lg'>Loading...</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold text-gray-900 mb-2'>Welcome</h1>
					<p className='text-gray-600'>Click on a card to navigate</p>
				</div>

				{cards.length === 0 ? (
					<div className='text-center text-gray-500'>
						No cards available yet
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{cards.map((card) => (
							<Card
								key={card.id}
								className='cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1'
								onClick={() => handleCardClick(card.link)}
							>
								<CardHeader>
									<CardTitle className='truncate'>{card.title}</CardTitle>
									<CardDescription className='line-clamp-2'>
										{card.description}
									</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
