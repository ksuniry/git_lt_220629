package com.mvc.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.mvc.dao.MainDao;
import com.mvc.dao.OneSetDao;
import com.util.CmmUtil;


@Service
public class OneSetService {
	
	@Autowired
	OneSetDao oneSetDao;
	
	private Logger logger = Logger.getLogger(OneSetService.class.getName());
	
	public void make8145060() throws Exception {
		
		List<Object> paramList = new ArrayList<Object>();
		Map<String,Object> params = null;
		Map<String,Object> rtnParams = null;
		
		int idx = 1;
		
		for(int i = 1 ; i <= 40 ; i ++ ) {
			for(int j = i+1 ; j <= 41 ; j ++ ) {
				for(int k = j+1 ; k <= 42 ; k ++ ) {
					for(int l = k+1 ; l <= 43 ; l ++ ) {
						for(int m = l+1 ; m <= 44 ; m ++ ) {
							for(int n = m+1 ; n <= 45 ; n ++ ) {
								params = new HashMap<String,Object>();
								params.put("idx", idx);
								params.put("num1", i);
								params.put("num2", j);
								params.put("num3", k);
								params.put("num4", l);
								params.put("num5", m);
								params.put("num6", n);
								rtnParams = CmmUtil.converterTwoDigits(params);
								params.put("all_str", rtnParams.get("num1")+","+rtnParams.get("num2")+","+rtnParams.get("num3")+","+rtnParams.get("num4")+","+rtnParams.get("num5")+","+rtnParams.get("num6"));
								paramList.add(params);
								if(idx % 4000 == 0 || (i==40 && j==41 && k==42 && l==43 && m==44 && n==45)) {
									//oneSetDao.insertTblFullList(paramList);
									oneSetDao.insertTblFullPoint(paramList);
									paramList = new ArrayList<Object>();
									logger.info(String.valueOf(idx));
								}
								idx++;
							}
						}
					}
				}
			}
		}
	}
	
	

}
