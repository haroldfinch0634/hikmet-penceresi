import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate("/admin");
		} catch (err) {
			setError("Invalid email or password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>Admin Login</CardTitle>
					<CardDescription>Sign in to manage cards</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={loading}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={loading}
							/>
						</div>
						{error && <p className='text-sm text-red-600'>{error}</p>}
						<Button type='submit' className='w-full' disabled={loading}>
							{loading ? "Signing in..." : "Sign In"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
