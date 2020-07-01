<!doctype html>
<html lang="ru">
  <head>
    <title>Создание map-а для модуля городов</title>
</head>
  <body>
      
<?
$arrjson = array();
$arrjson = array(
    'sett_global'=>array(
        'map_img'=>'Map.png',
        'width'=>841,
        'height'=>521
    ),
    'sett_yac' => array(
        'start_yac_x'=>0,
        'start_yac_y'=>0,
        'kol_w'=>21,
        'kol_h'=>13,
        'yac_w'=>40,
        'yac_h'=>40,
        'c_border'=>'#0000002e'
    ),
    'sett_cities'=>array(
        'width'=>9,
        'height'=>9,
        'bg_color'=>'#FFF40A'
    ),
    'sett_popup'=>array(
        'width_img'=>84,
        'height_img'=>84,
        'border_wh'=>5,
        'border_color'=>'#FFFFFF',
        'hidden_time'=>3,
        'max_open'=>5
    )
);
$ch = 0;
$noview = array(
    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,20,21,
    22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,41,42,
    43,44,45,46,47,48,49, 52, 54,55,56, 62,63,
    64,65,66,67, 76, 84,
    85,86,87,
    106,107,
    127,
    169,
    230,231,
    232, 235,236, 238, 248, 251,252,
    253,254,255,256,257,258,259,260,261, 265,266,267,268,269,270,271,272,273

);
for ($ih=1;$ih<=13;$ih++){
    for ($iw=1;$iw<=21;$iw++){
        $ch++;
        $areaname = 'Округ '.$ch;
        $areaindex = $iw.'_'.$ih;
        $view = in_array($ch, $noview) ? 0 : 1; 
        $cities = array();
        $imglist = array();
        if ($ch==88){
            $imglist = array('/cities/armalit/01.png','/cities/armalit/02.png','/cities/armalit/03.png');
        }
        if ($ch==128){
            $imglist = array('/cities/armalit/04.png','/cities/armalit/05.png','/cities/armalit/06.png');
        }
        if ($ch==151){
            $imglist = array('/cities/armalit/07.png','/cities/armalit/08.png','/cities/armalit/09.png');
        }

        if ($ch==132){
            $imglist = array('/cities/burevestnik/01.png','/cities/burevestnik/02.png','/cities/burevestnik/03.png');
        }
        if ($ch==110){
            $imglist = array('/cities/burevestnik/04.png','/cities/burevestnik/05.png');
        }
        if ($ch==175){
            $imglist = array('/cities/burevestnik/06.png');
        }

        if ($ch==131){
            $imglist = array('/cities/skbk/01.png','/cities/skbk/02.png','/cities/skbk/03.png');
        }
        if ($ch==130){
            $imglist = array('/cities/skbk/04.png','/cities/skbk/05.png');
        }
        if ($ch==150){
            $imglist = array('/cities/skbk/06.png');
        }


        if ($ch==206){
            $imglist = array('/cities/askold/01.png','/cities/askold/02.png','/cities/askold/03.png');
        }
        if ($ch==187){
            $imglist = array('/cities/askold/04.png','/cities/askold/05.png','/cities/askold/06.png');
        }
        if ($ch==228){
            $imglist = array('/cities/askold/07.png','/cities/askold/08.png');
        }
        if ($ch==250){
            $imglist = array('/cities/askold/09.png','/cities/askold/10.png');
        }


        if ($ch==108){
            $cities = array(
                array(
                    'name'=>'Санкт-Петербург',
                    'left'=>30,
                    'top'=>30
                ),
                array(
                    'name'=>'Гатчина',
                    'left'=>15,
                    'top'=>33
                )
            );
        }
        if ($ch==151){
            $cities = array(
                array(
                    'name'=>'Москва',
                    'left'=>5,
                    'top'=>20
                )
            );
        }
        if ($ch==229){
            $cities = array(
                array(
                    'name'=>'Арсеньев',
                    'left'=>18,
                    'top'=>33
                )
            );
        }



        $arrjson['map'][$iw.'_'.$ih]=array(
            'id'=>$ch,
            'name' => $areaname,
            'imglist'=> $imglist,
            'cities'=>$cities,
            'view'=>$view
        );
    }

}


$echojson = json_encode($arrjson, JSON_UNESCAPED_UNICODE);
file_put_contents('json/map.json', $echojson);
?>
<pre>
<?
print_r(json_decode($echojson));

?>
</pre>
    </body>
</html>
