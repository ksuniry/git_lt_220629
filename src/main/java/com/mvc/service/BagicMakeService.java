package com.mvc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mvc.controller.BagicMakeController;
import com.mvc.dao.BagicMakeDao;
import com.mvc.dao.MainDao;
import com.util.CmmUtil;
import com.util.FormulaUtil;


@Service
public class BagicMakeService {
	
	@Autowired
	BagicMakeDao bagicMakeDao;
	@Autowired
	MainDao mainDao;
	
	private Logger logger = Logger.getLogger(BagicMakeController.class.getName());
	
	public Map<String,Object> makeStair() throws Exception{
		Map<String,Object> rtnMap = new HashMap<String,Object>();
		
		{
			//당첨번호 마지막 chapter
			Integer winMaxChapter = mainDao.selMaxChapter();	
			Map<String,Object> insStairMap = new HashMap<String,Object>();
			//계단식 마지막 chapter
			Integer stairMaxchapt = bagicMakeDao.selStair6MaxChapter();
			
			if(winMaxChapter != null && !winMaxChapter.equals(stairMaxchapt)){
				
				Map<String,Object> stairInfo = null;
				if(stairMaxchapt == null) {
					stairInfo = new HashMap<String,Object>();
					for(int j = 1 ; j < 46 ; j++) {
						stairInfo.put("num"+j,j);
					}
					Map<String,Object> winInfo = mainDao.selWinInfo(1);
					insStairMap =FormulaUtil.winNumToMakeStair(stairInfo, winInfo,6);
					stairMaxchapt = 1;
					insStairMap.put("chapter", stairMaxchapt);
					bagicMakeDao.insertStair6(insStairMap);
				}
				
				for(int i=stairMaxchapt ; i < winMaxChapter ; i++) {
					stairInfo = bagicMakeDao.selStair6Info(i);
					logger.info("stair6 insChapter : "+i+"/// stairInfo : "+(stairInfo == null ? "null": CmmUtil.mapSortToString(stairInfo)));
					
					//당첨번호 정보
					Map<String,Object> winInfo = mainDao.selWinInfo(i+1);
					insStairMap =FormulaUtil.winNumToMakeStair(stairInfo, winInfo,6);
					insStairMap.put("chapter", i+1);
					bagicMakeDao.insertStair6(insStairMap);
				}
			}
		}
		
		{
			//당첨번호 마지막 chapter
			Integer winMaxChapter = mainDao.selMaxChapter();	
			Map<String,Object> insStairMap = new HashMap<String,Object>();
			//계단식 마지막 chapter
			Integer stairMaxchapt = bagicMakeDao.selStair7MaxChapter();
			
			if(winMaxChapter != null && !winMaxChapter.equals(stairMaxchapt)){
				
				Map<String,Object> stairInfo = null;
				if(stairMaxchapt == null) {
					stairInfo = new HashMap<String,Object>();
					for(int j = 1 ; j < 46 ; j++) {
						stairInfo.put("num"+j,j);
					}
					Map<String,Object> winInfo = mainDao.selWinInfo(1);
					insStairMap =FormulaUtil.winNumToMakeStair(stairInfo, winInfo,7);
					stairMaxchapt = 1;
					insStairMap.put("chapter", stairMaxchapt);
					bagicMakeDao.insertStair7(insStairMap);
				}
				
				for(int i=stairMaxchapt ; i < winMaxChapter ; i++) {
					stairInfo = bagicMakeDao.selStair7Info(i);
					logger.info("stair7 insChapter : "+i+"/// stairInfo : "+(stairInfo == null ? "null": CmmUtil.mapSortToString(stairInfo)));
					
					//당첨번호 정보
					Map<String,Object> winInfo = mainDao.selWinInfo(i+1);
					insStairMap =FormulaUtil.winNumToMakeStair(stairInfo, winInfo,7);
					insStairMap.put("chapter", i+1);
					bagicMakeDao.insertStair7(insStairMap);
				}
			}
		}
		
		{
			//Order 당첨번호 마지막 chapter
			Integer winMaxOrderChapter = mainDao.selMaxOrderChapter();	
			Map<String,Object> insOrderStairMap = new HashMap<String,Object>();
			//Order 계단식 마지막 chapter
			Integer orderStairMaxchapt = bagicMakeDao.selOrderStair6MaxChapter();
			
			if(winMaxOrderChapter != null && !winMaxOrderChapter.equals(orderStairMaxchapt)){
				
				Map<String,Object> orderStairInfo = null;
				if(orderStairMaxchapt == null) {
					orderStairInfo = new HashMap<String,Object>();
					for(int j = 1 ; j < 46 ; j++) {
						orderStairInfo.put("num"+j,j);
					}
					Map<String,Object> winInfo = mainDao.selWinInfo(1);
					insOrderStairMap =FormulaUtil.winNumToMakeStair(orderStairInfo, winInfo,6);
					orderStairMaxchapt = 1;
					insOrderStairMap.put("chapter", orderStairMaxchapt);
					bagicMakeDao.insertOrderStair6(insOrderStairMap);
				}
				
				for(int i=orderStairMaxchapt ; i < winMaxOrderChapter ; i++) {
					orderStairInfo = bagicMakeDao.selOrderStair6Info(i);
					logger.info("orderStair6 insChapter : "+i+"/// stairInfo : "+(orderStairInfo == null ? "null": CmmUtil.mapSortToString(orderStairInfo)));
					
					//당첨번호 정보
					Map<String,Object> orderWinInfo = mainDao.selOrderWinInfo(i+1);
					insOrderStairMap =FormulaUtil.winNumToMakeStair(orderStairInfo, orderWinInfo,6);
					insOrderStairMap.put("chapter", i+1);
					bagicMakeDao.insertOrderStair6(insOrderStairMap);
				}
			}
		}
		
		{
			//Order 당첨번호 마지막 chapter
			Integer winMaxOrderChapter = mainDao.selMaxOrderChapter();	
			Map<String,Object> insOrderStairMap = new HashMap<String,Object>();
			//Order 계단식 마지막 chapter
			Integer orderStairMaxchapt = bagicMakeDao.selOrderStair7MaxChapter();
			if(winMaxOrderChapter != null && !winMaxOrderChapter.equals(orderStairMaxchapt)){
				
				Map<String,Object> orderStairInfo = null;
				if(orderStairMaxchapt == null) {
					orderStairInfo = new HashMap<String,Object>();
					for(int j = 1 ; j < 46 ; j++) {
						orderStairInfo.put("num"+j,j);
					}
					Map<String,Object> winInfo = mainDao.selWinInfo(1);
					insOrderStairMap =FormulaUtil.winNumToMakeStair(orderStairInfo, winInfo,7);
					orderStairMaxchapt = 1;
					insOrderStairMap.put("chapter", orderStairMaxchapt);
					bagicMakeDao.insertOrderStair7(insOrderStairMap);
					
				}
				
				for(int i=orderStairMaxchapt ; i < winMaxOrderChapter ; i++) {
					orderStairInfo = bagicMakeDao.selOrderStair7Info(i);
					logger.info("orderStair7 insChapter : "+i+"/// stairInfo : "+(orderStairInfo == null ? "null": CmmUtil.mapSortToString(orderStairInfo)));
					
					//당첨번호 정보
					Map<String,Object> orderWinInfo = mainDao.selOrderWinInfo(i+1);
					insOrderStairMap =FormulaUtil.winNumToMakeStair(orderStairInfo, orderWinInfo,7);
					insOrderStairMap.put("chapter", i+1);
					bagicMakeDao.insertOrderStair7(insOrderStairMap);
				}
			}
		}
		
		return rtnMap;
	}
	
	public Map<String,Object> makeVr1Stair() throws Exception{
		String[] vr1_bagic_tbl = {"tbl_win_stair6","tbl_win_stair7","tbl_order_win_stair6","tbl_order_win_stair7"};
		
		{// 초기화 : 아무것도 없을때
			List<Map<String,Object>> init_list = bagicMakeDao.selVr1StairByBagicIdxList(1);
			if(init_list != null && init_list.size() == 4){
				//정상 임 그냥 진행
			}else {
				//다 지우고 처음 1회내용을  넣어줌(180).
				 bagicMakeDao.delVr1Stair();
				 
				 Map<String,Object> bagicStairMap = null;
				 Map<String,Object> insMap = null;
				 int[] bagicStairArr = null;
				 int insChapter = 0;
				 int insNum = 0;
				 //기준이 되는 기본 계단식 4개로 for문 		 
				 for(int i=0 ; i < vr1_bagic_tbl.length ; i++ ) {
					 insMap = new HashMap<String,Object>(); 
					 switch(i) {
					 	case 0 : bagicStairMap = bagicMakeDao.selStair6Info(1);
					 		break;
					 	case 1 : bagicStairMap = bagicMakeDao.selStair7Info(1);
				 			break;
					 	case 2 : bagicStairMap = bagicMakeDao.selOrderStair6Info(1);
				 			break;
					 	case 3 : bagicStairMap = bagicMakeDao.selOrderStair7Info(1);
				 			break;
					 }
					 
					 bagicStairArr = CmmUtil.map45ToIntArray(bagicStairMap);
					 insChapter = Integer.parseInt(String.valueOf(bagicStairMap.get("chapter")));
					 
					 for(int j = 0 ; j < 45 ; j++) {
						 insMap.put("vrstair_cd",vr1_bagic_tbl[i]+"_"+(j+1));
						 insMap.put("bagic_source", vr1_bagic_tbl[i]);
						 insMap.put("bagic_idx",j+1);
						 insMap.put("chapter",insChapter);
						 for(int k = 0 ; k < 45 ; k++) {
							 insNum = bagicStairArr[k]+Integer.parseInt(String.valueOf(bagicStairArr[j]));
							 insMap.put("num"+(k+1),insNum > 45 ? insNum -45 : insNum);
						 }
						 
						 logger.info(insMap.toString());
						 
						 bagicMakeDao.insVr1Stair(insMap);
					 }
				 }
			}
		}		
		
		Map<String,Object> rtnMap = new HashMap<String,Object>();
		Map<String,Object> params = null;
		int[] selBagicTbl_arr = null;
		int max_chapter = 0;
		int win_max_chapter = mainDao.selMaxChapter();
		int insNum = 0;
		for(int i=1 ; i < 46 ; i++) {
			 List<Map<String,Object>> list = bagicMakeDao.selVr1StairByBagicIdxList(i);
			 for(int j = 0 ; j < list.size() ; j++) {
				 // 각 구룹의  max_chapter 기준으로 
				 max_chapter = CmmUtil.mapGetInteger(list.get(j),"max_chapter");
				 
				 params = new HashMap<String,Object>();
				 params.put("vrstair_cd",CmmUtil.mapGetString(list.get(j),"vrstair_cd"));
				 params.put("bagic_source",CmmUtil.mapGetString(list.get(j),"bagic_source"));
				 params.put("bagic_idx",CmmUtil.mapGetInteger(list.get(j),"bagic_idx"));
				 
				 for(int k=max_chapter+1 ; k <=win_max_chapter ; k++) {
					 params.put("chapter", k);
					 selBagicTbl_arr = CmmUtil.map45ToIntArray(bagicMakeDao.selVr1StairOfBagicTbl(params));
					
					 for(int l = 0 ; l < 45 ; l++) {
							 //i 는 해당 더하는 key이다
						 	if(j+1%2 == 1) {
						 		insNum = selBagicTbl_arr[l]+selBagicTbl_arr[i];
						 	}else {
						 		insNum = selBagicTbl_arr[44-l]+selBagicTbl_arr[i];
						 	}
							 params.put("num"+(l+1),insNum > 45 ? insNum - 45 : insNum);
					
					 }
					 logger.info(params.toString());
					 bagicMakeDao.insVr1Stair(params);
				 }
				 
			 }
			 
		}
		
		return rtnMap;
	}
	
	public Map<String,Object> makeVr2Stair() throws Exception{
		
		//VR1_TBL_STAIR 은 어차피 다 있을테니 
		Map<String,Object> bagic_map = null;
		Map<String,Object> vr2Stair = null;
		String vr1stair_cd = null;
		for(int i = 1 ; i < 46 ; i++) {
			List<Map<String,Object>> bagic_list = bagicMakeDao.selVr1StairOfVrstairCdByBagicIdx(i);
			for(int j = 0 ; j < bagic_list.size() ; j++) {
				//VRSTAIR_CD 만 이걸 가지고 최대 VR2_TBL_STAIR의 max chapter를 구해야함 
				bagic_map = bagic_list.get(j);
				vr1stair_cd = CmmUtil.mapGetString(bagic_map, "vrstair_cd");
				vr2Stair = bagicMakeDao.selVr2StairMaxChapter(vr1stair_cd);
			}
		}
		
		
		String[] vr1_bagic_tbl = {"tbl_win_stair6","tbl_win_stair7","tbl_order_win_stair6","tbl_order_win_stair7"};
		
		{
			List<Map<String,Object>> init_list = bagicMakeDao.selVr1StairByBagicIdxList(1);
			if(init_list != null && init_list.size() == 4){
				//정상 임 그냥 진행
			}else {
				//다 지우고 처음 1회내용을  넣어줌(180).
				 bagicMakeDao.delVr1Stair();
				 
				 Map<String,Object> bagicStairMap = null;
				 Map<String,Object> insMap = null;
				 int[] bagicStairArr = null;
				 int insChapter = 0;
				 int insNum = 0;
				 //기준이 되는 기본 계단식 4개로 for문 		 
				 for(int i=0 ; i < vr1_bagic_tbl.length ; i++ ) {
					 insMap = new HashMap<String,Object>(); 
					 switch(i) {
					 	case 0 : bagicStairMap = bagicMakeDao.selStair6Info(1);
					 		break;
					 	case 1 : bagicStairMap = bagicMakeDao.selStair7Info(1);
				 			break;
					 	case 2 : bagicStairMap = bagicMakeDao.selOrderStair6Info(1);
				 			break;
					 	case 3 : bagicStairMap = bagicMakeDao.selOrderStair7Info(1);
				 			break;
					 }
					 
					 bagicStairArr = CmmUtil.map45ToIntArray(bagicStairMap);
					 insChapter = Integer.parseInt(String.valueOf(bagicStairMap.get("chapter")));
					 
					 for(int j = 0 ; j < 45 ; j++) {
						 insMap.put("vrstair_cd",vr1_bagic_tbl[i]+"_"+(j+1));
						 insMap.put("bagic_tbl", vr1_bagic_tbl[i]);
						 insMap.put("bagic_idx",j+1);
						 insMap.put("chapter",insChapter);
						 for(int k = 0 ; k < 45 ; k++) {
							 insNum = bagicStairArr[k]+Integer.parseInt(String.valueOf(bagicStairArr[j]));
							 insMap.put("num"+(k+1),insNum > 45 ? insNum -45 : insNum);
						 }
						 
						 logger.info(insMap.toString());
						 
						 bagicMakeDao.insVr1Stair(insMap);
					 }
				 }
			}
		}		
		
		Map<String,Object> rtnMap = new HashMap<String,Object>();
		Map<String,Object> params = null;
		int[] selBagicTbl_arr = null;
		int max_chapter = 0;
		int win_max_chapter = mainDao.selMaxChapter();
		int insNum = 0;
		for(int i=1 ; i < 46 ; i++) {
			 List<Map<String,Object>> list = bagicMakeDao.selVr1StairByBagicIdxList(i);
			 for(int j = 0 ; j < list.size() ; j++) {
				 // 각 구룹의  max_chapter 기준으로 
				 max_chapter = CmmUtil.mapGetInteger(list.get(j),"max_chapter");
				 
				 params = new HashMap<String,Object>();
				 params.put("vrstair_cd",CmmUtil.mapGetString(list.get(j),"vrstair_cd"));
				 params.put("bagic_tbl",CmmUtil.mapGetString(list.get(j),"bagic_tbl"));
				 params.put("bagic_idx",CmmUtil.mapGetInteger(list.get(j),"bagic_idx"));
				 
				 for(int k=max_chapter+1 ; k <=win_max_chapter ; k++) {
					 params.put("chapter", k);
					 selBagicTbl_arr = CmmUtil.map45ToIntArray(bagicMakeDao.selVr1StairOfBagicTbl(params));
					
					 for(int l = 0 ; l < 45 ; l++) {
							 //i 는 해당 더하는 key이다
						 	if(j+1%2 == 1) {
						 		insNum = selBagicTbl_arr[l]+selBagicTbl_arr[i];
						 	}else {
						 		insNum = selBagicTbl_arr[44-l]+selBagicTbl_arr[i];
						 	}
							 params.put("num"+(l+1),insNum > 45 ? insNum - 45 : insNum);
					
					 }
					 logger.info(params.toString());
					 bagicMakeDao.insVr1Stair(params);
				 }
				 
			 }
			 
		}
		
		return rtnMap;
	}
	
	

}
