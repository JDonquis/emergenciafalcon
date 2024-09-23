<script>
    import { page } from "$app/stores";
    
    $: url = $page.route.id
    console.log($page)
    const navPages = [
        {
            icon: "mdi:patient-outline",
            href: "/nomina",
            name: "Nómina"
        },
       
        

    ]
</script>

<nav class="left_nav bg-color1 rounded-tr-md  pt-2 text-white text-opacity-90">
    
    <ul
        class="flex justify-around items-center h-full md:flex-col
    md:items-start md:justify-normal md:p-2 md:gap-1 md:[&>*]:w-full"
    >
    {#each navPages as page }
        <li>
            <a href={'/dashboard'+page.href} class="flex md:gap-2 items-center p-2 " class:active={url == '/dashboard'+page.href}
                ><iconify-icon class="text-xlc md:text-lg" icon={page.icon} /><span class="label_link hidden md:block"
                    >{page.name}</span
                ></a
            >
    </li>
    {/each}
      
    </ul>
</nav>

<style>
    .active {
        background: #9BF2EA;
        border-radius: 6px;
        box-shadow: 0 0 10px 0px #9BF2EA;
        color: #275950 !important;
        font-weight: bold;
    }
</style>