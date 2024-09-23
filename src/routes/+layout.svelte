<script>
	import { onMount } from 'svelte';
	import '../app.css';

	import {browser} from "$app/environment"

	// $: if (
	// 		!$authStore?.currentUser &&
	// 		!$authStore.isLoading &&
	// 		window.location.pathname != '/'
	// 	) {
	// 		window.location.href = '/';
	// 	 } else if (
	// 		$authStore?.currentUser &&
	// 		!$authStore.isLoading &&
	// 		window.location.pathname === '/'
	// 	) {
	// 		window.location.href = '/dashboard';
	// 	}
</script>

<slot />
