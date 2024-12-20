<script>
    import Table from "../../components/Table.svelte";
    import Modal from "../../components/Modal.svelte";
    import Input from "../../components/Input.svelte";
    import StatusColor from "../../components/StatusColor.svelte";
    import Pagination from "../../components/Pagination.svelte";
    import debounce from "lodash/debounce";
    import Search from "../../components/Search.svelte";
    import { displayAlert } from "../../stores/alertStore";
    import { useForm, router, page } from "@inertiajs/svelte";
    export let data = {};
    export let areas = [];
    // Update data based on the current state of `data.specialties`
    const today = new Date();
    // Format the date to YYYY-MM-DD
    const formattedDate = today.toISOString().split("T")[0];

    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    const emptyDataForm = {
        patient_id: null,
        patient_name: "",
        patient_last_name: "",
        patient_ci: "",
        patient_sex: "",
        patient_date_birth: "",
        patient_phone_number: "",

        cases: [],
        newCase: {
            doctor: {
                id: $page.props.auth.user_id,
                name: $page.props.auth.name,
                last_name: $page.props.auth.last_name,
            },
            start_date: formattedDate,
            end_date: formattedDate,
            start_time: formattedTime,
            end_time: formattedTime,
            treatment: "",
            diagnosis: "",
            status: "Alta",
            area: "",
        },
    };
    let form = useForm(structuredClone(emptyDataForm));

    let visulizateType = "table";
    let showModal = false;

    function handleSubmit(event) {
        event.preventDefault();
        if ($form.cases.length == 0) {
            $form.cases = [$form.newCase];
        } else {
            $form.cases = [$form.newCase, ...$form.cases];
        }
        $form.clearErrors();
        if (submitStatus == "Crear") {
            $form.post("/admin/historial-medico", {
                onError: (errors) => {
                    if (errors.data) {
                        displayAlert({ type: "error", message: errors.data });
                    }

                    $form.cases.shift();
                },
                onSuccess: (mensaje) => {
                    // $form.defaults()
                    $form.reset();
                    $form.newCase = { ...emptyDataForm.newCase };
                    displayAlert({
                        type: "success",
                        message: "Nuevo Caso creado con exito",
                    });
                    showModal = false;
                },
            });
        }
    }
    $: console.log($form);

    const searchPatient = debounce((ci) => {
        showModal = true;

        router.get(
            "/admin/historial-medico",
            { ci },
            {
                preserveState: true,
                only: ["patient"],
                onSuccess: (page) => {
                    // showModal = true;
                    if (page.props.patient == null) {
                        return;
                    }
                    $form = {
                        ...$form,
                        ...page.props.patient.data,
                        cases: page.props.patient.data.cases,
                    };
                },
                onFinish: (visit) => {
                    prosecingSearchPatient = false;
                },
            },
        );
    }, 210);

    function goToDetailsPatientPage(id) {
        router.get("/admin/historial-medico/detalle-paciente/" + id);
    }
    let submitStatus = "Crear";
    let prosecingSearchPatient = false;

    function timeBetweenDateAndTime(
        startDate,
        startTime,
        endDate,
        endTime,
        status,
    ) {
        // Combine date and time strings into a single Date object
        if (status == "Permanencia") {
            const now = new Date(); // Get the current date and time
            endDate = now.toISOString().split("T")[0]; // Format to YYYY-MM-DD
            endTime = now.toTimeString().split(" ")[0].substring(0, 5); // Format to HH:mm
        }
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        const diffInMs = endDateTime - startDateTime; // Difference in milliseconds
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        if (diffInDays > 0) {
            if (diffInHours > 0) {
                return `${diffInDays} Dia${diffInDays > 1 ? "s" : ""}, ${diffInHours - 24} Hr${diffInHours > 1 ? "s" : ""}`;
            } else {
                return `${diffInDays} Dia${diffInDays > 1 ? "s" : ""}`;
            }
        } else if (diffInHours > 0) {
            return `${diffInHours} Hr${diffInHours > 1 ? "s" : ""}`;
        } else {
            return `${diffInMinutes} Min${diffInMinutes > 1 ? "s" : ""}`;
        }
    }

    $: if (showModal) {
        setTimeout(() => {
            if (showModal == true) {
                document.querySelector("input[name='ci']")?.focus();
            }
        }, 100);
    }
</script>

<svelte:head>
    <title>Historial médico</title>
</svelte:head>

<Modal bind:showModal modalClasses={"max-w-[560px]"}>
    <p slot="header" class="opacity-60">Registrar un nuevo caso</p>
    <form id="a-form" on:submit={handleSubmit} action="">
        <fieldset
            class="px-5 mt-4 md:grid grid-cols-2 gap-x-5 w-full border p-6 pt-2 border-red rounded-md"
        >
            <legend
                class="text-center px-5 py-1 pt-1.5 rounded-xl bg-color1 text-gray-100"
                >DATOS DEL PACIENTE</legend
            >
            {#if $form?.patient_ci.toString().length >= 6}
                <div class="w-full col-span-2 h-6 overflow-hidden text-center">
                    {#if prosecingSearchPatient}
                        <iconify-icon
                            class="text-3xl"
                            icon="eos-icons:three-dots-loading"
                        ></iconify-icon>
                    {:else if $form?.patient_id !== null}
                        <span
                            class="flex items-center gap-2 text-center mx-auto justify-center"
                        >
                            <iconify-icon
                                class="text-2xl text-color1"
                                icon="iconoir:settings-profiles"
                            ></iconify-icon>
                            <small>Paciente Registrado</small>
                        </span>
                    {:else}
                        <span
                            class="flex items-center gap-2 text-center mx-auto justify-center"
                        >
                            <iconify-icon
                                class="text-3xl"
                                icon="clarity:new-line"
                            ></iconify-icon>
                            <small>Nuevo paciente</small>
                        </span>
                    {/if}
                </div>
            {/if}
            <div>
                <Input
                    type="number"
                    required={true}
                    label={"C.I *"}
                    name={"ci"}
                    min={100000}
                    placeholder={"Minimo 6 números"}
                    bind:value={$form.patient_ci}
                    on:input={() => {
                        prosecingSearchPatient = true;
                        $form.patient_id = null;
                        $form.cases = [];
                        if ($form.patient_ci.toString().length >= 6) {
                            searchPatient($form.patient_ci);
                        }
                    }}
                    error={$form.errors?.patient_ci}
                />
                <!-- <button
                    type="button"
                    title="Buscar si el paciente existe"
                    class="bg-color4 h-fit px-2 rounded hover:bg-color1 hover:text-white"
                    on:click={() => {
                        searchPatient($form.patient_ci);
                    }}
                >
                    {#if prosecingSearchPatient == true}
                        <iconify-icon
                            class="mt-2 text-2xl"
                            icon="eos-icons:bubble-loading"
                        ></iconify-icon>
                    {:else}
                        <iconify-icon
                            class="mt-2 text-2xl"
                            icon="material-symbols:search"
                        ></iconify-icon>
                    {/if}
                </button> -->
            </div>
            <Input
                type="text"
                required={true}
                label={"Nombres *"}
                bind:value={$form.patient_name}
                readOnly={$form.patient_id}
                error={$form.errors?.patient_name}
            />
            <Input
                type="text"
                required={true}
                label={"Apellidos *"}
                bind:value={$form.patient_last_name}
                readOnly={$form.patient_id}
                error={$form.errors?.patient_last_name}
            />

            <Input
                type="date"
                required={true}
                label={"Fecha de Nacimiento*"}
                bind:value={$form.patient_date_birth}
                readOnly={$form.patient_id}
                error={$form.errors?.patient_date_birth}
            />
            <div class="flex flex-col mt-6">
                <label class="py-1 cursor-pointer hover:bg-gray-100">
                    <input
                        class="mr-3 inline-block"
                        type="radio"
                        bind:group={$form.patient_sex}
                        value="Masculino"
                        name="sex"
                        id=""
                    /><span class:font-bold={$form.patient_sex == "Masculino"}
                        >Masculino</span
                    >
                </label>

                <label class="py-1 cursor-pointer hover:bg-gray-100">
                    <input
                        class="mr-3 inline-block"
                        type="radio"
                        bind:group={$form.patient_sex}
                        value="Femenino"
                        name="sex"
                        id=""
                    /><span class:font-bold={$form.patient_sex == "Femenino"}
                        >Femenino</span
                    >
                </label>
            </div>

            <Input
                type="tel"
                label={"Teléfono"}
                readOnly={$form.patient_id}
                bind:value={$form.patient_phone_number}
                error={$form.errors?.patient_phone_number}
            />
        </fieldset>

        <fieldset
            class="px-5 mt-4 md:grid grid-cols-2 gap-x-5 w-full border p-6 pt-2 border-red rounded-md"
        >
            <legend
                class="text-center px-5 py-1 pt-1.5 rounded-xl bg-color1 text-gray-100"
                >DATOS DE LA EMERGENCIA</legend
            >
            <Input
                type="date"
                required={true}
                label={"Fecha de entrada *"}
                bind:value={$form.newCase.start_date}
                error={$form.errors?.newCase?.start_date}
            />

            <Input
                type="time"
                required={true}
                label={"Hora de entrada *"}
                bind:value={$form.newCase.start_time}
                error={$form.errors?.newCase?.start_time}
            />

            <Input
                type="select"
                required={true}
                label={"Estado *"}
                bind:value={$form.newCase.status}
                error={$form.errors?.newCase?.status}
            >
                <option value="Alta"> Alta </option>
                <option value="Permanencia">Permanencia </option>
                <option value="Remitido">Remitido </option>
                <option value="Fallecido">Fallecido </option>
            </Input>
            {#if $form.newCase.status == "Remitido"}
                <Input
                    type="select"
                    required={true}
                    label={"Area remitida *"}
                    bind:value={$form.newCase.area}
                    error={$form.errors?.newCase?.area}
                >
                    {#each areas as area (area.id)}
                        <option value={area}>{area.name} </option>
                    {/each}
                </Input>
            {/if}
            {#if $form.newCase.status !== "Permanencia"}
                <Input
                    type="date"
                    label={"Fecha de salida "}
                    bind:value={$form.newCase.end_date}
                    error={$form.errors?.newCase?.end_date}
                />
                <Input
                    type="time"
                    required={true}
                    label={"Hora de salida *"}
                    bind:value={$form.newCase.end_time}
                    error={$form.errors?.newCase?.end_time}
                />
            {/if}
        </fieldset>

        <fieldset
            class="px-5 mt-4 md:grid grid-cols-2 gap-x-5 w-full border p-6 pt-2 border-red rounded-md"
        >
            <legend
                class="text-center px-5 py-1 pt-1.5 rounded-xl bg-color1 text-gray-100"
                >DIAGNÓSTICO Y TRATAMIENTO</legend
            >
            <Input
                type="textarea"
                required={true}
                classes={"col-span-2"}
                label={"Diagnóstico *"}
                bind:value={$form.newCase.diagnosis}
                error={$form?.errors?.newCase?.diagnosis}
            />

            <Input
                type="textarea"
                required={true}
                classes={"col-span-2"}
                label={"Tratamiento *"}
                bind:value={$form.newCase.treatment}
                error={$form.errors?.newCase?.treatment}
            />
        </fieldset>
    </form>
    <input
        form="a-form"
        slot="btn_footer"
        type="submit"
        value={$form.processing ? "Cargando..." : submitStatus}
        class="hover:bg-color3 hover:text-white duration-200 mt-auto w-full bg-color4 text-black font-bold py-3 rounded-md cursor-pointer"
    />
</Modal>

<div class="flex justify-between items-center">
    <button
        class="btn_create inline-block p-2 px-3"
        on:click={(e) => {
            e.preventDefault();

            showModal = true;
            submitStatus = "Crear";
        }}
        title="Crear un nuevo caso"
    >
        <span class="md:hidden text-4xl relative top-1 font-bold"
            ><iconify-icon icon="ic:round-add"></iconify-icon></span
        >
        <span class="hidden md:block"> Nuevo caso </span>
    </button>

    <div class="text-gray-600 text-xl md:text-2xl">
        <iconify-icon
            class="cursor-pointer mr-2"
            title="Vizualizar tipo Tabla"
            on:click={() => (visulizateType = "table")}
            icon="material-symbols:table-sharp"
            class:text-color1={visulizateType == "table"}
            class:bg-color4={visulizateType == "table"}
        ></iconify-icon>
        <iconify-icon
            class="cursor-pointer"
            title="Vizualizar tipo lista"
            on:click={() => (visulizateType = "card")}
            icon="carbon:show-data-cards"
            class:text-color1={visulizateType == "card"}
            class:bg-color4={visulizateType == "card"}
        ></iconify-icon>
    </div>
</div>

{#if visulizateType == "table"}
    <Table
        filtersOptions={{ status: [{ name: "Alta", id: "Alta" },
            { name: "Remitido", id: "Remitido" },
            { name: "Permanencia", id: "Permanencia" },
            { name: "Fallecido", id: "Fallecido" },
        ] }}
        allowSearch={false}
    >
        <div slot="filterBox"></div>
        <thead slot="thead" class="sticky top-0">
            <tr>
                <th style="font-size: 12px;">N°</th>
                <th>Duración</th>
                <th>Estado</th>
                <th>Paciente</th>
                <th>Diagnóstico</th>
                <th>Tratamiento</th>
                <th>Doctor</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#if data?.data?.length > 0 && data?.data?.[0].cases.length > 0}
                {#each data?.data as row, i (row.patient_id)}
                    <tr
                        on:click={(e) => {
                            goToDetailsPatientPage(row.patient_id);
                        }}
                        class={`md:max-h-[200px] overflow-hidden cursor-pointer  hover:bg-gray-500 hover:bg-opacity-5`}
                    >
                        <td style="font-size: 12px;"
                            >{data.meta.total -
                                (data.meta.current_page - 1) *
                                    data.meta.per_page -
                                i}</td
                        >
                        <td>
                            {timeBetweenDateAndTime(
                                row.cases?.[0]?.start_date,
                                row.cases?.[0]?.start_time,
                                row.cases?.[0]?.end_date,
                                row.cases?.[0]?.end_time,
                                row.cases?.[0]?.status,
                            )}

                            <!-- {formatDateSpanish(row.cases[0].start_date)} -->
                        </td>

                        <td style="white-space: normal;">
                            <StatusColor status={row.cases?.[0]?.status} />
                            <p>
                                {#if row.cases?.[0]?.status == "Remitido"}
                                    {row.cases?.[0]?.area?.name}
                                {/if}
                            </p>
                        </td>
                        <td class="min-w-[120px]">
                            <div class="flex items-center gap-2">
                                {#if row.patient_sex == "Femenino"}
                                    <span class="text-pink text-2xl">
                                        <iconify-icon icon="fa-solid:female"
                                        ></iconify-icon>
                                    </span>
                                {:else}
                                    <span class="text-color3 text-2xl">
                                        <iconify-icon icon="fa-solid:male"
                                        ></iconify-icon>
                                    </span>
                                {/if}
                                <span class="whitespace-normal"
                                    >{row.patient_name}
                                    {row.patient_last_name}
                                    - {row.patient_ci}
                                </span>
                            </div>
                        </td>
                        <td
                            class="max-w-[340px] min-w-[290px] md:min-w-[320px] max-h-[100px] overflow-hidden"
                            style="white-space: normal;"
                        >
                            {#if row.cases?.[0]?.diagnosis.length > 240}
                                {row.cases?.[0]?.diagnosis.slice(0, 240)}
                                <span
                                    class="leading-3 text-2xl inline-block font-bold text-color1 relative"
                                    >...</span
                                >
                            {:else}
                                {row.cases?.[0]?.diagnosis}
                            {/if}
                        </td>
                        <!-- <td>{row.sex}</td> -->
                        <td
                            class="max-w-[340px] min-w-[290px] md:min-w-[320px] max-h-[100px] overflow-hidden"
                            style="white-space: normal;"
                        >
                            {#if row.cases?.[0]?.treatment.length > 240}
                                {row.cases?.[0]?.treatment.slice(0, 240)}
                                <span
                                    class="leading-3 text-2xl inline-block font-bold text-color1 relative"
                                    >...</span
                                >
                            {:else}
                                {row.cases?.[0]?.treatment}
                            {/if}
                        </td>
                        <!-- <td>{row.rep_name} {row.rep_last_name}</td> -->
                        <td>
                            {row.cases?.[0]?.doctor.name}
                            {row.cases?.[0]?.doctor.last_name}
                        </td>
                    </tr>
                {/each}
            {/if}
        </tbody>
    </Table>
{/if}

{#if visulizateType == "card"}
    <div class="lg:grid lg:grid-cols-2 gap-3 mt-3">
        {#each data?.data as row, i (row.patient_id)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <article
                on:click={(e) => {
                    goToDetailsPatientPage(row.patient_id);
                }}
                class={`border mb-3 relative w-full cursor-pointer bg-gray-50 p-2 md:p-5 rounded-md shadow-sm hover:bg-gray-500 hover:bg-opacity-5`}
            >
                <span
                    class="h-fit absolute right-0 top-0 text-center col-span-2 bg-gray-100 p-1 rounded-lg inline-block w-10 px-2"
                    >{i + 1}°</span
                >
                <div class="flex gap-2 items-center">
                    <p>
                        {timeBetweenDateAndTime(
                            row.cases?.[0]?.start_date,
                            row.cases?.[0]?.start_time,
                            row.cases?.[0]?.end_date,
                            row.cases?.[0]?.end_time,
                            row.cases?.[0]?.status,
                        )}
                    </p>
                    |
                    <StatusColor status={row.cases?.[0]?.status} />
                    {#if row.cases?.[0]?.status == "Remitido"}
                        a {row.cases?.[0]?.area?.name}
                    {/if}
                </div>

                <div class="flex items-center gap-2 mt-1">
                    {#if row.patient_sex == "Femenino"}
                        <span class="text-pink text-lg sm:text-2xl">
                            <iconify-icon icon="fa-solid:female"></iconify-icon>
                        </span>
                    {:else}
                        <span class="text-color3 text-lg sm:text-2xl">
                            <iconify-icon icon="fa-solid:male"></iconify-icon>
                        </span>
                    {/if}
                    <span
                        >{row.patient_name}
                        {row.patient_last_name}
                        - {row.patient_ci}
                    </span>
                </div>

                <div class="mt-2">
                    <p>
                        <iconify-icon
                            class="text-lg sm:text-2xl relative top-1.5 text-red"
                            icon="material-symbols:diagnosis"
                        ></iconify-icon>
                        {#if row.cases[0].diagnosis.length > 240}
                            {row.cases[0].diagnosis.slice(0, 240)}
                            <span
                                class="leading-3 text-2xl inline-block font-bold text-color1 relative"
                                >...</span
                            >
                        {:else}
                            {row.cases[0].diagnosis}
                        {/if}
                    </p>
                </div>
                <div class="mt-2">
                    <p>
                        <iconify-icon
                            class="text-lg sm:text-2xl relative top-1.5 text-color1"
                            icon="mdi:medicine-bottle"
                        ></iconify-icon>
                        {#if row.cases[0].treatment.length > 240}
                            {row.cases[0].treatment.slice(0, 240)}
                            <span
                                class="leading-3 text-2xl inline-block font-bold text-color1 relative"
                                >...</span
                            >
                        {:else}
                            {row.cases[0].treatment}
                        {/if}
                    </p>
                </div>

                <!-- <td>{row.rep_name} {row.rep_last_name}</td> -->
                <p
                    class="text-right justify-end w-full flex items-center gap-2"
                >
                    {row.cases[0].doctor.name}
                    {row.cases[0].doctor.last_name}
                    <iconify-icon icon="mdi:doctor" style="font-size: 20px;"
                    ></iconify-icon>
                </p>
            </article>
        {/each}
    </div>
{/if}

<Search />
<div class="col-span-2">
    <Pagination pagination={{ ...data?.meta, ...data?.links }} />
</div>

<style>
</style>
