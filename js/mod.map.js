/* первичные переменные */
let parent_div = document.getElementById('boxmap'); // родительский div в котором и будет карта

let obj = get_json('/json/map.json');// объект хранящий в себе данные из json

let img_list = {};

let top_popup = -(obj.sett_popup.height_img-5);// верхняя точка для popup 
let left_popup = -(obj.sett_popup.width_img/2-15)// левая точка для popup

let curr_time = 0;// текущее время в секундах

// данные по открытым popup
let arr_popup_open_id = [];
let arr_popup_open_elem = [];
let arr_popup_open_time = [];



/*
    Далее - функции по работе модуля
*/

// получаем json ajax-ом
function get_json(filename){
    $.ajax({
        url: filename,
        async: false,
        dataType: 'json',
        success: function (json) {
          val = json;
        }
      });
    return val;
}

/*
создание ячейки карты. По сути, мы располагаем на карте ячейки с заданными размерами. Некая матрица/сетка.
*/
// create_divyac(   родительский блок, объект с данными по ячейке, шириная ячейки, 
//                  высота ячейки, расположение left относительно карты, расположение top относительно карты, 
//                  цвет границы ячейки, объект хранящий в себе весь json)
function create_divyac(div, data, w_yac, h_yac, left, top, border, obj_global){
    id = data.id;
    cities = '';
    cities_length = Object.values(data.cities).length;
    if (cities_length>0){
        cities_all = Object.values(data.cities);
        for (ic=0;ic<cities_length;ic++){
            cities_current = cities_all[ic];
            cities = cities+'<div class="map_city" style="left:'+cities_current.left+'px;top:'+cities_current.top+'px;background-color:'+obj_global.sett_cities.bg_color+';width:'+obj_global.sett_cities.width+'px;height:'+obj_global.sett_cities.height+'px;"></div><div class="m_c_name" style="left:'+(cities_current.left-25)+'px;top:'+(cities_current.top-10)+'px;">'+cities_current.name+'</div>';// создаем точки городов внутри ячейки
        }
        
    }
    
    img_box_data = '';
    content_img = Object.values(data.imglist);
    if (content_img.length>0){
        img_list[id] = content_img;
        for(i_i=0;i_i<content_img.length;i_i++){
            img_box_data = img_box_data+'<div class="popup_img_box" id="map_popup_'+id+'_'+i_i+'" style="background-image:url(/img'+content_img[i_i]+');width:'+obj_global.sett_popup.width_img+'px;left:'+(left_popup)+'px;height:'+obj_global.sett_popup.height_img+'px;top:'+(top_popup)+'px;border:'+obj_global.sett_popup.border_wh+'px solid '+obj_global.sett_popup.border_color+';"></div>';// создание popup на указанной точке. Сколько изображений внутри одной клетки, столько разных popup и будет создано
        }
    }
    content = '<div class="map_yac" id="map_yac_'+id+'" style="left:'+left+'px;top:'+top+'px;width:'+w_yac+'px;height:'+h_yac+'px;border:1px solid '+border+';border-left:1px solid '+border+';"><div style="position:relative">'/*+data.id*/+cities+img_box_data+'</div></div>';// создание ячейки карты
    div.innerHTML = div.innerHTML + content;// добавление внутрь div
}


/* Функция вызова popup-окошка */
function open_popup(){
    i_listarr_key = Object.keys(img_list);
    choose_val = Math.floor(Math.random() * i_listarr_key.length);// выбрали случайный id с картинками 
    i_listarr_value = Object.values(img_list);
    choose_val_img = Math.floor(Math.random() * i_listarr_value[choose_val].length);// выбрали случайную картинку из содержимого id
    
    popup_elem = document.getElementById('map_popup_'+i_listarr_key[choose_val]+'_'+choose_val_img);// выбираем элемент что хотим сделать видимым
    // если элемент ещё не виден, а значит не показывается, а так же нет наслоений(см функцию popup_layers), то выполняем...
    if ((popup_elem.style.opacity==0) && (popup_layers(i_listarr_key[choose_val],arr_popup_open_id))){

        // если popup с таким id уже открыт - то ошибочка, иначе - всё ок. (хотя, не факт что это произойдет, при opacity 0, но кто его знает...)
        var index = arr_popup_open_id.indexOf(i_listarr_key[choose_val]);
        if (index !== -1) {return false;} 

        // добавляем id и элементы в массивы
        arr_popup_open_id.push(i_listarr_key[choose_val]);
        arr_popup_open_elem.push(popup_elem);
        arr_popup_open_time.push(curr_time+obj.sett_popup.hidden_time);// записываем время, когда элемент соответствующий индексу массива, должен исчезнуть. Не setTimeout так как несколько timeouts перекроют друг друга и первые картинки будут открыты вечность =(
        popup_elem.style.opacity = 1;// делаем popup видимыми
        popup_elem.style.zIndex=3;
    };

}

// функция проверки наслоений нового popup с открытыми popup 
// popup_layers(родительский id, массив со списком открытых id)
function popup_layers(parent_id, arr_id){
    elem_parent_choose = document.getElementById('map_yac_'+parent_id);
    elem_xstart = parseInt(elem_parent_choose.style.left)+left_popup;// левая граница
    elem_ystart = parseInt(elem_parent_choose.style.top)+top_popup;// верхняя граница
    elem_xstart_end = parseInt(elem_parent_choose.style.left)+left_popup+obj.sett_popup.width_img;// правая граница
    elem_ystart_end = parseInt(elem_parent_choose.style.top)+top_popup+obj.sett_popup.height_img;// нижняя граница
    
    for (i_arr=0;i_arr<arr_id.length;i_arr++){// идем по массиву открытых id
        elem_parent = document.getElementById('map_yac_'+arr_id[i_arr]);// выбираем элемент из выведенного popup

        e_p_x = parseInt(elem_parent.style.left)+left_popup;// левая граница
        e_p_y = parseInt(elem_parent.style.top)+top_popup; // верхняя граница
        e_p_x_end = e_p_x+obj.sett_popup.width_img;// правая граница
        e_p_y_end = e_p_y+obj.sett_popup.height_img;// нижняя граница

        /* Можно сделать через проверку вхождения в область каждого из углов(некое подобие маски), 
        но это слишком большое условие для каждого из углов. Поэтому, сделал через вычитание расстояния до точки(по модулю)*/
        if (
            (Math.abs(elem_xstart-e_p_x)<=obj.sett_popup.width_img)
            ||
            (Math.abs(elem_ystart-e_p_y)<=obj.sett_popup.height_img)
        )
        {
            open_popup();// а-ля рекурсия для создания нового окошка, если это "не пошло".
            return false;// прерываем дальнейшее выполнение
        }
    }
    return true;
}


// функция старта модуля
function start_module(){
    parent_div.style.backgroundImage = 'url(/img/'+obj.sett_global.map_img+')';// устанавливаем картинку фона карты
    parent_div.style.width = obj.sett_global.width+'px';// ширина блока карты
    parent_div.style.height = obj.sett_global.height+'px';// высота блка карты

    map_values = Object.values(obj.map);
    for (i=0;i<map_values.length;i++){
        i_w = (i) % obj.sett_yac.kol_w;// высчитываем точку x в матрице/сетке значений
        i_h = Math.floor( (i) / obj.sett_yac.kol_w);// высчитываем точку y в матрице/сетке значений
        if (map_values[i].view){// если ячейка видимая, то создаем блок
            create_divyac(parent_div, map_values[i], obj.sett_yac.yac_w, obj.sett_yac.yac_h, obj.sett_yac.start_yac_x+(i_w)*obj.sett_yac.yac_w, obj.sett_yac.start_yac_y+(i_h)*obj.sett_yac.yac_h,obj.sett_yac.c_border,obj);
        }
    }
    
    parent_div.style.opacity=1;// делаем видимым нашу карту после размещения всех элементов на карте

    // ежесекундное выполнение. Некая step-функция
    setInterval(function() {
        if (arr_popup_open_id.length<obj.sett_popup.max_open){// если количество открытых popup - меньше чем указано допустимое количество в json
            open_popup();// вызов popup-окошка
        }

        if (curr_time>arr_popup_open_time[0])// берем самый дальний созданный popup(т.е. получается, что самый первый в массиве)
        {
            arr_popup_open_id.splice(0, 1);// удаляем из всех массивов!!! Агррррр!!!
            arr_popup_open_time.splice(0, 1);
            arr_popup_open_elem[0].style.opacity=0;
            arr_popup_open_elem[0].style.zIndex=-1;
            arr_popup_open_elem.splice(0, 1);
        }
        curr_time++;// таймер, куда же без него :)
    }, 1000);
};

/* ну и вызов самого "модуля" - тадааааам! */
start_module();// старт модуля 


// От Яши (o゜▽゜)o--☆ \(^-^)/ 