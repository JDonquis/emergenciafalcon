<?php

namespace App\Http\Controllers;

use App\Services\EmergencyCaseService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class EmergencyCaseController extends Controller
{
    private $params = [];
    private EmergencyCaseService $emergencyCaseService;


    public function __construct()
    {
        $this->emergencyCaseService = new EmergencyCaseService;
    }

    public function index(Request $request)
    {
        $this->params = [
            'search' => $request->input('search') ?? null,
            'page' => $request->input('page') ?? null,
            'rows' => $request->input('rows') ?? null,
        ];

        $emergencyCases = $this->emergencyCaseService->getCases($this->params);

        return inertia('Dashboard/HistorialMedico',[
            'data' => $emergencyCases
        ]);

    }

   
   
    public function store(Request $request)
    {
        DB::beginTransaction();

        try 
        {
            $data = $request->all();

            $this->emergencyCaseService->createCase($data);

            DB::commit();

            return redirect()->back()->with(['message' => 'Caso registrado con exito']);

        }
        catch (\Throwable $e)
        {   
            
            DB::rollback();
            
            return redirect()->back()->withErrors(['data' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}