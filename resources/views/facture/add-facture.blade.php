@extends('app')

@section('title','Ajouter Facture')

@section('custom_meta')
<meta name="csrf-token" content="{{ csrf_token() }}">
@endsection

@section('custom_libs')
<link href="{{ asset('assets/libs/select2/select2.min.css') }}" rel="stylesheet" />
@endsection

@section('content_page')
<div class="row">
    <div class="col-lg-12 col-md-12 col-12">
      <!-- Page header -->
        <div class="border-bottom pb-4 mb-4 ">
            <h3 class="mb-0 fw-bold">Facture</h3>
      </div>
    </div>
</div>

<div class="row">
    <div class="col-xl-12 col-lg-12 col-md-12 col-12">
        <form action="{{ route('facture.store') }}" method="post">
            @csrf
        <div class="card h100">
            <div class="card-header bg-white py-4">
                <div class="row">
                    <div class="col-xs-12 col-md-4">
                        <input class="form-control form-control-sm" placeholder="N° facture" type="text" id="facture_num" name="facture_num" value="{{ old('facture_num') }}">
                    </div>
                    <div class="col-xs-12 col-md-8">
                        <div class="input-group">
                            <select form="frm_add_devie" class="livesearchclient form-control" id="client" name="client"></select>
                        </div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-xs-12 col-md-6">
                        <div class="input-group">
                            <select class="livesearchproduit form-control" id="list_produits" name="livesearchproduit"></select>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-2">
                        <input class="form-control form-control-sm" placeholder="QTE" type="text" id="produit_qte">
                        <input type="hidden" id="produit_price">
                        <input type="hidden" name="produits" id="produits_ids">
                        <input type="hidden" name="quantities" id="quantities_values">
                    </div>
                    <div class="col-xs-12 col-md-4">
                        <div class="input-group">
                            <input class="form-control form-control-sm" placeholder="Prix Total" type="text" id="produit_price_total">
                            <button class="btn btn-secondary btn-sm" type="button" id="btn_add_produit"><i class="bi bi-plus"></i></button>
                            <button class="btn btn-secondary btn-sm d-none" type="button" id="btn_update_produit"><i class="bi bi-pencil-square"></i></button>
                        </div>
                    </div>
                    <div class="col-xs-12 mt-2">
                        <button type="submit" name="btnAdd" id="btnAdd" class="btn btn-primary btn-sm w-100">Ajouter</button>
                    </div>
                </div>
            </div>
        </form>
            <div class="table-responsive">
                <table class="table text-nowrap mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>N°</th>
                        <th>REF</th>
                        <th>Libelle</th>
                        <th>Prix U</th>
                        <th>Quantité en stock</th>
                        <th>Quantité</th>
                        <th>Prix T</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody id="tbl_tbody_produits">

                    </tbody>
                    <tfoot id="tbl_tfoot_price_global">
                        <tr>
                            <td colspan="2">Prix total HT</td>
                            <td colspan="7" id="prix_total_devie_HT">...</td>
                        </tr>
                        <tr>
                            <td colspan="2">Prix total (TT) du devie</td>
                            <td colspan="7" id="prix_total_devie_TT">...</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@section('custom_script')
<script>
    var bons = {{ Illuminate\Support\Js::from($bon_commandes) }};
</script>
<script src="{{ asset('assets/libs/select2/select2.min.js') }}"></script>
<script src="{{ asset('js/facture/add-facture.js') }}"></script>
@endsection