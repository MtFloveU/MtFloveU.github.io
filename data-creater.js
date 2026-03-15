/**
 * 获取数据对象 vueReport：为报告Vue对象
 */
var dataGetter = {
	/** ************************* 普通考试 ************************** */
	// 获取全科数据
	totalGetter: function(drawWeek) {
		if(vueReport.cache["-100"].init) {
			axios.get(vueReport.exam.base + "/app/student/cj/report-total?seid=" + vueReport.exam.id, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				var data = response.data.desc,
				scoreGap = data.stuOrder.scoreGap;
				var stuOrder = {
					orders: [],
					gaps: [],
					classOrderShow: data.orderFlag > 0,
					schoolOrderShow: data.orderFlag > 0 && data.orderFlag < 3,
					unionOrderShow: data.orderFlag == 1 && data.examType != 0,
					topShow: data.topFlag != 0,
					avgShow: data.avgFlag != 0,
					scoreShow:data.scoreFlag ===true,
					levelShow:data.levelFlag ===true,
				};

				for(var i=0; i< data.stuOrder.subjects.length; i++) { // 处理成绩单
					var order = data.stuOrder.subjects[i];
					stuOrder.orders.push({
						id: order.id,
						name: order.name,
						score: order.score,
						paperScore: order.paperScore,
						classOrder: order.classOrder,
						schoolOrder: order.schoolOrder,
						unionOrder: order.unionOrder,
						level:order.level
					});
				}
				// 处理分数差距数据
				stuOrder.gaps[0] = {
					type: "class",
					name: "班级",
					num: scoreGap.classNum,
					top: scoreGap.classTop,
					avg: scoreGap.classAvg,
					FV: scoreGap.classFV
				};
				stuOrder.gaps[1] = {
					type: "school",
					name: "学校",
					num: scoreGap.schoolNum,
					top: scoreGap.schoolTop,
					avg: scoreGap.schoolAvg,
					FV: scoreGap.schoolFV
				};
				if(data.examType != 0) {
					stuOrder.gaps[2] = {
						type: "union",
						name: data.examTypeStr,
						num: scoreGap.unionNum,
						top: scoreGap.unionTop,
						avg: scoreGap.unionAvg,
						FV: scoreGap.unionFV
					};
				}
				for(var g = 0;g < stuOrder.gaps.length; g++) {
					if((data.topFlag == 2 && stuOrder.gaps[g].type == "union") || (data.topFlag == 3 && (stuOrder.gaps[g].type == "union" || stuOrder.gaps[g].type == "school"))) {
						stuOrder.gaps[g].top = "-";
					}
					if((data.avgFlag == 2 && stuOrder.gaps[g].type == "union") || (data.avgFlag == 3 && (stuOrder.gaps[g].type == "union" || stuOrder.gaps[g].type == "school"))) {
						stuOrder.gaps[g].avg = "-";
					}
				}
				stuOrder.scoreGapDesc = filterStuOrderDesc(data.stuOrder.scoreGapDesc);
				data.stuOrder = stuOrder;

				Vue.set(vueReport.cache['-100'], "stuOrder", data.stuOrder);
				Vue.set(vueReport.cache['-100'], "showYxb", data.showYxb);
				Vue.set(vueReport.cache['-100'], "showQkdny", data.showQkdny);
				Vue.set(vueReport.cache['-100'], "showLxcj", data.showLxcj);
				Vue.set(vueReport.cache['-100'], "showBkzn", data.showBkzn);
				Vue.set(vueReport.cache['-100'], "examType", data.examType);
				Vue.set(vueReport.cache['-100'], "examTypeStr", data.examTypeStr);
				Vue.set(vueReport.cache['-100'], "orderFlag", data.orderFlag);
				Vue.set(vueReport.cache['-100'], "segmentFlag", data.segmentFlag);
				Vue.set(vueReport.cache['-100'], "avgFlag", data.avgFlag);
				Vue.set(vueReport.cache['-100'], "nsFlag", data.nsFlag);
				Vue.set(vueReport.cache['-100'], "init", false);
				Vue.set(vueReport.cache, "lastmodified", vueReport.exam.lastmodified);
				if(vueReport.cache[vueReport.subject.id].segmentFlag == 3){vueReport.segment.tag = "class";}
				updateCache();
				vueReport.loading = false;
			}).catch(function(error) {
				console.log("totalGetter : " + error);
			});
		} else {
			if(vueReport.cache[vueReport.subject.id].segmentFlag == 3){vueReport.segment.tag = "class";}
			vueReport.loading = false;
		}
	},
	// 获取单科数据
	subjectGetter: function(id, name, index) {
		axios.get(vueReport.exam.base + "/app/student/cj/report-subject?seid=" + vueReport.exam.id + "&subjectid=" + id, {withCredentials:true}).then(function(response) {
			if(response.data.result != 1) {
				wishApp.callSessionException(response.data.result);
			}
			var data = response.data.desc,
			scoreGap = data.stuOrder.scoreGap;
			var stuOrder = {
				gaps: [],
				classOrderShow: data.orderFlag > 0,
				schoolOrderShow: data.orderFlag > 0 && data.orderFlag < 3,
				unionOrderShow: data.orderFlag == 1 && data.examType != 0,
				topShow: data.topFlag != 0,
				avgShow: data.avgFlag != 0,
				scoreShow:data.scoreFlag ===true,
				levelShow:data.levelFlag ===true,

			};
			// 处理分数差距数据
			stuOrder.gaps[0] = {
				type: "class",
				name: "班级",
				num: scoreGap.classNum,
				top: scoreGap.classTop,
				avg: scoreGap.classAvg,
				FV: scoreGap.classFV
			};
			stuOrder.gaps[1] = {
				type: "school",
				name: "学校",
				num: scoreGap.schoolNum,
				top: scoreGap.schoolTop,
				avg: scoreGap.schoolAvg,
				FV: scoreGap.schoolFV
			};
			if(data.examType != 0) {
				stuOrder.gaps[2] = {
					type: "union",
					name: data.examTypeStr,
					num: scoreGap.unionNum,
					top: scoreGap.unionTop,
					avg: scoreGap.unionAvg,
					FV: scoreGap.unionFV
				};
			}
			for(var g = 0;g < stuOrder.gaps.length; g++) {
				if((data.topFlag == 2 && stuOrder.gaps[g].type == "union") || (data.topFlag == 3 && (stuOrder.gaps[g].type == "union" || stuOrder.gaps[g].type == "school"))) {
					stuOrder.gaps[g].top = "-";
				}
				if((data.avgFlag == 2 && stuOrder.gaps[g].type == "union") || (data.avgFlag == 3 && (stuOrder.gaps[g].type == "union" || stuOrder.gaps[g].type == "school"))) {
					stuOrder.gaps[g].avg = "-";
				}
			}
			stuOrder.scoreGapDesc = filterStuOrderDesc(data.stuOrder.scoreGapDesc);
			data.stuOrder = stuOrder;

			// 难度失分分析
			data.loses = [{
				title: "简单题"
			}, {
				title: "中等题"
			}, {
				title: "难题"
			}];
			for(var l = 0; l < 3; l++) {
				data.loses[l].num = data["loseScoreCount" + (l + 1)];
				data.loses[l].total = data["loseTotalScore" + (l + 1)];
				data.loses[l].lose = data["loseScore" + (l + 1)];
				data.loses[l].rate = data["loseTotalRateScore" + (l + 1)];
				delete data["loseScoreCount" + (l + 1)];
				delete data["loseTotalScore" + (l + 1)];
				delete data["loseScore" + (l + 1)];
				delete data["loseTotalRateScore" + (l + 1)];
			}
			// 提分指导
			var guide = {
				totalScore: data.questiontotalScore,
				analysisDesc: data.analysisDesc,
				improves: []
			}
			var showAbi = false;
			var showKnowledge = false;
			if(data.questions1Score > 0 && data.questions1.length > 0) {
				showAbi = false;
				showKnowledge = false;
				for(var q = 0; q < data.questions1.length; q++){
					var question = data.questions1[q];
					if(question.ability.length > 0){
						showAbi = true;
					}
					if(question.knowledge.length > 0){
						showKnowledge = true;
					}
				}

				guide.improves.push({
					title: "可快速提升空间",
					subTitle: "同水平学生及大多数同学已掌握题目：",
					data: data.questions1,
					score: data.questions1Score,
					type: "fast",
					showAbi: showAbi,
					showKnowledge: showKnowledge
				});
			}
			if(data.questions2Score > 0 && data.questions2.length > 0) {
				showAbi = false;
				showKnowledge = false;
				for(var q = 0; q < data.questions2.length; q++){
					var question = data.questions2[q];
					if(question.ability.length > 0){
						showAbi = true;
					}
					if(question.knowledge.length > 0){
						showKnowledge = true;
					}
				}
				guide.improves.push({
					title: "可稳固提升空间",
					subTitle: "同水平学生已掌握、可攻克的题目：",
					data: data.questions2,
					score: data.questions2Score,
					type: "improve",
					showAbi: showAbi,
					showKnowledge: showKnowledge
				});
			}
			if(data.questions3.length > 0) {
				showAbi = false;
				showKnowledge = false;
				for(var q = 0; q < data.questions3.length; q++){
					var question = data.questions3[q];
					if(question.ability.length > 0){
						showAbi = true;
					}
					if(question.knowledge.length > 0){
						showKnowledge = true;
					}
				}
				guide.improves.push({
					title: "注重巩固空间",
					subTitle: "比同水平学生掌握好的题目，要巩固学习，避免猜中答案而忽略知识点漏洞",
					data: data.questions3,
					score: 0,
					type: "attention",
					showAbi: showAbi,
					showKnowledge: showKnowledge
				});
			}
			Vue.set(vueReport.cache, id, {});
			Vue.set(vueReport.cache[id], "loses", data.loses);
			Vue.set(vueReport.cache[id], "stuOrder", data.stuOrder);
			Vue.set(vueReport.cache[id], "questRates", data.questRates);
			Vue.set(vueReport.cache[id], "guide", guide);
			Vue.set(vueReport.cache[id], "examType", data.examType);
			Vue.set(vueReport.cache[id], "examTypeStr", data.examTypeStr);
			Vue.set(vueReport.cache[id], "orderFlag", data.orderFlag);
			Vue.set(vueReport.cache[id], "segmentFlag", data.segmentFlag);
			Vue.set(vueReport.cache[id], "avgFlag", data.avgFlag);
			Vue.set(vueReport.cache[id], "questionScoreShow",data.questionScoreShow);
			Vue.set(vueReport.cache[id], "questionRateShow",data.questionRateShow);

			updateCache();
			vueReport.subjectSwitch(id, name, index);
		}).catch(function(error) {
			console.log("scoresGetter : " + error);
		});
	},
	// 科目列表
	subjectsGetter: function() {
		if(vueReport.cache.subjects === undefined) { // 处理科目列表
			axios.get(vueReport.exam.base + "/app/student/cj/subject-list?seid=" + vueReport.exam.id, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				var subjects = [{
					name: "全科",
					id: -100
				}];
				Vue.set(vueReport.cache, "subjects", subjects.concat(response.data.desc));
				updateCache();
			}).catch(function(error) {
				console.log("subjectsGetter : " + error);
			});
		}
	},
	// 成长曲线
	growGetter: function() {
		var grow = vueReport.grow;
		if(vueReport.cache[vueReport.subject.id].grow == undefined) {
			Vue.set(vueReport.cache[vueReport.subject.id], "grow", {});
		}
		if(vueReport.cache[vueReport.subject.id].grow[vueReport.grow.tag] == undefined) {
			axios.get(vueReport.exam.base + "/app/student/cj/grow?seid=" + vueReport.exam.id + "&subjectid=" + vueReport.subject.id + "&type=" + vueReport.grow.tag, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				var growData = response.data.desc,
				xData = [],
				seriesData = [],
				pointX = 0,
				pointY = 0;
				for(var i = 0; i < 5; i++) {
					xData.push(growData.selist[i] != undefined ? growData.selist[i].examdate : "");
					seriesData.push(growData.selist[i] != undefined ? growData.selist[i].orderrate : "");
					if(growData.selist[i] != undefined && growData.selist[i].id == vueReport.exam.id) {
						pointX = i;
						pointY = growData.selist[i].orderrate;
					}
				}

				var growDesc = response.data.desc.growdesc;
				var desc = "";
				if(growDesc.indexOf("有进步") > -1 || growDesc.indexOf("进步较大") > -1 || growDesc.indexOf("大幅进步") > -1) {
					if(growDesc.indexOf("大幅进步") > -1) {
						growDesc = "有大幅进步";
					}
					desc += "较上一次考试<font color=\"#ff7e61\">" + growDesc + "</font>";
					desc += "，小悟真为你高兴！小悟建议你要认真总结这一段时间的学习态度和学习方法，继续保持这个劲头儿，相信成绩会稳步提升！";
				} else if(growDesc.indexOf("没有变化") > -1 || growDesc.indexOf("没有明显变化") > -1) {
					desc += "较上一次考试<font color=\"#ff7e61\">" + growDesc + "</font>";
					desc += "，逆水行舟不进则退,虽然你这次考试没有取得进步，但是能够保持成绩，也说明你这一段时间付出了努力！";
				} else if(growDesc.indexOf("有退步") > -1 || growDesc.indexOf("退步较大") > -1 || growDesc.indexOf("大幅退步") > -1) {
					if(growDesc.indexOf("大幅退步") > -1) {
						growDesc = "有大幅退步";
					}
					desc += "较上一次考试<font color=\"#ff7e61\">" + growDesc + "</font>";
					desc += "，要引起重视，把该次考试做错的题进行错因分析、总结，相信成绩会有提升！";
				}
				Vue.set(vueReport.cache[vueReport.subject.id].grow, vueReport.grow.tag,{
					xData: xData,
					seriesData: seriesData,
					pointX: pointX,
					pointY: pointY,
					desc: base64.encode(desc)
				});
				updateCache();
				charts.drawGrow("growChart", xData, seriesData, pointX, pointY);
			}).catch(function(error){
				console.log("growGetter ： " + error);
			});
		} else {
			var data = vueReport.cache[vueReport.subject.id].grow[vueReport.grow.tag];
			charts.drawGrow("growChart", data.xData, data.seriesData, data.pointX, data.pointY);
		}
	},
	// 你的位置
	segmentGetter: function(drawFlag) {
		var segment = vueReport.segment;
		if(vueReport.cache[vueReport.subject.id].segment == undefined) {
			Vue.set(vueReport.cache[vueReport.subject.id], "segment", {});
		}
		var url;
		if(vueReport.exam.nsflag == "0"){
			url = vueReport.exam.base + "/app/student/cj/segment-list?seid=" + vueReport.exam.id + "&subjectid=" + vueReport.subject.id + "&type=" + segment.tag;
		}
		if(vueReport.exam.nsflag == "1"){
			url = vueReport.exam.base + "/app/student/ns/segment-list?seid=" + vueReport.subject.seID + "&subjectid=" + vueReport.subject.id  + "&examcode=" + vueReport.subject.examCode + "&type=" + segment.tag
		}
		if(vueReport.cache[vueReport.subject.id].segment[vueReport.segment.tag] == undefined) {
			axios.get(url, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				var segmentData = response.data.desc;
				var xData = [],
				seriesData = [],
				pointX, pointY, pointSegment;
				for(var segment = 0; segment < segmentData.length; segment++) {
					xData.push(segmentData[segment].minscore + "~" + segmentData[segment].maxscore);
					seriesData.push(segmentData[segment].num);
					if(segmentData[segment].stuflag) {
						pointX = segmentData[segment].minscore + "~" + segmentData[segment].maxscore;
						pointY = segmentData[segment].num;
						pointSegment = segmentData[segment].minscore + "~" + segmentData[segment].maxscore;
					}
				}

				Vue.set(vueReport.cache[vueReport.subject.id].segment, vueReport.segment.tag, {
					xData: xData,
					seriesData: seriesData,
					pointX: pointX,
					pointY: pointY,
					pointSegment: pointSegment
				});
				updateCache();
				if(drawFlag) {
					if(xData.length == 0){
						Vue.set(vueReport.segment, "noData", true);
					}else{
						charts.drawSegment("segmentChart", xData, seriesData, pointX, pointY);
					}
				}
			}).catch(function(error) {
				console.log("segmentGetter : " + error);
			});
		} else {
			if(drawFlag) {
				var segment = vueReport.cache[vueReport.subject.id].segment[vueReport.segment.tag];
				if(segment.xData.length == 0){
					Vue.set(vueReport.segment, "noData", true);
				}else{
					charts.drawSegment("segmentChart", segment.xData, segment.seriesData, segment.pointX, segment.pointY);
				}
			}
		}
	},

	// 薄弱科目
	weekGetter: function(type){

		var url = vueReport.exam.base + "/app/student/cj/week?seid=" + vueReport.exam.id + "&type=" + type
		var week = vueReport.cache['-100'].week[type];
		if(week){
			charts.drawWeek("weekChart", week, vueReport.cache['-100'].stuOrder[type + "OrderShow"]);
		}
		else{
			axios.get(url, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				var data = response.data.desc;
				var week = {
					indicator: [],
					subjects: [],
					total: [],
					desc: data.weekSubjectDesc||""
				};
				for(var key = 0;key < data.weekSubjects.length; key++) {
					week.indicator.push({
						name: data.weekSubjects[key].subject,
						max: 100
					});
					week.subjects.push(data.weekSubjects[key].orderRate);
					week.total.push(data.orderRate);
				}
				Vue.set(vueReport.cache['-100'].week, type, week);
				updateCache();
				charts.drawWeek("weekChart", week, vueReport.cache['-100'].stuOrder[type + "OrderShow"]);
			}).catch(function(error) {
				console.log("Getter : " + error);
			});
		}
	},

	// 知识点列表
	knowledgeGetter: function() {
		var url;
		if(vueReport.exam.nsflag == "0"){
			url = vueReport.exam.base + "/app/student/cj/knowledge?seid=" + vueReport.exam.id + "&subjectid=" + vueReport.subject.id;
		}
		if(vueReport.exam.nsflag == "1"){
			url = vueReport.exam.base + "/app/student/ns/knowledge?seid=" + vueReport.subject.seID + "&subjectid=" + vueReport.subject.id + "&examcode=" + vueReport.subject.examCode;
		}
		if(vueReport.cache[vueReport.subject.id].knowledges == undefined) {
			axios.get(url, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				Vue.set(vueReport.cache[vueReport.subject.id], "knowledges", response.data.desc.knowledges);
				updateCache();
			}).catch(function(error) {
				console.log("knowledgeGetter : " + error);
			});
		}
	},
	// 考查能力表
	qtcGetter: function() {
		var url;
		if(vueReport.exam.nsflag == "0"){
			url = vueReport.exam.base + "/app/student/cj/qtc?seid=" + vueReport.exam.id + "&subjectid=" + vueReport.subject.id;
		}
		if(vueReport.exam.nsflag == "1"){
			url = vueReport.exam.base + "/app/student/ns/qtc?seid=" + vueReport.subject.seID + "&subjectid=" + vueReport.subject.id+ "&examcode=" + vueReport.subject.examCode;
		}
		if(vueReport.cache[vueReport.subject.id].qtc == undefined) {
			axios.get(url, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				var qtcs = response.data.desc.qtcs,
				minVal = 101,
				maxVal = -1,
				minStr = "",
				maxStr = "",
				desc = "";
				for(var q = 0; q < qtcs.length; q++) {
					var qtc = qtcs[q], rate = parseFloat(qtc.scoreRate);
					if(rate == minVal) {
						minStr += "," + qtc.name;
					}
					if(rate == maxVal) {
						maxStr += "," + qtc.name;
					}
					if(rate < minVal) {
						minVal = rate;
						minStr = qtc.name;
					}
					if(rate > maxVal) {
						maxVal = rate;
						maxStr = qtc.name;
					}
				}

				if(minVal >= 60 && maxVal >= 60) {
					desc += "&nbsp;&nbsp;&nbsp;&nbsp;哎哟，不错哦！各能力表现都挺好的！<br/>";
					if(minVal != maxVal) {
						desc += "&nbsp;&nbsp;&nbsp;&nbsp;其中" + maxStr + "表现最好，" + minStr + "表现相对最薄弱，继续保持优势，相对薄弱的能力要在日常学习过程中有意识的加强锻炼，多做习题，会慢慢得到改善滴！";
					}
				} else if(minVal < 60 && maxVal >= 60) {
					desc += "&nbsp;&nbsp;&nbsp;&nbsp;" + maxStr + "表现最好，" + minStr + "表现相对最薄弱，继续保持优势，相对薄弱的能力要在日常学习过程中有意识的加强锻炼，多做习题，会慢慢得到改善滴！";
				} else if(minVal < 60 && maxVal < 60) {
					desc += "&nbsp;&nbsp;&nbsp;&nbsp;各能力表现都有提升空间，看来不加油不行了哦！<br/>";
					if(minVal != maxVal) {
						desc += "&nbsp;&nbsp;&nbsp;&nbsp;其中" + maxStr + "表现最好，" + minStr + "表现相对最薄弱，要在日常学习过程中有意识的加强锻炼，多做习题，会慢慢得到改善滴！";
					}
				}

				Vue.set(vueReport.cache[vueReport.subject.id], "qtc", {
					data: qtcs,
					desc: desc
				});
				updateCache();
				if(vueReport.cache[vueReport.subject.id].qtc.data.length > 0 && !vueReport.vip.brd) {
					charts.drawQtc("qtcChart", vueReport.cache[vueReport.subject.id].qtc.data);
				} else {
					vueReport.qtcInit = false;
				}
			}).catch(function(error) {
				console.log("qtcGetter : " + error);
			});
		} else {
			if(vueReport.cache[vueReport.subject.id].qtc.data.length > 0 && !vueReport.vip.brd) {
				charts.drawQtc("qtcChart", vueReport.cache[vueReport.subject.id].qtc.data);
			} else {
				vueReport.qtcInit = false;
			}
		}
	},
	// 乾坤大挪移
	moveClassesGetter: function() {
		if(vueReport.cache["-100"].moveClasses == undefined) {
			axios.get(vueReport.exam.base + "/app/student/cj/order-yy?seid=" + vueReport.exam.id, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				Vue.set(vueReport.cache["-100"], "moveClasses", response.data.desc);
				updateCache();
			}).catch(function(error) {
				console.log("moveClassesGetter : " + error);
			});
		}
	},
	// 英雄榜
	heroesGetter: function() {
		if(vueReport.cache["-100"].heroes == undefined) {
			axios.get(vueReport.exam.base + "/app/student/cj/class-order?seid=" + vueReport.exam.id, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				Vue.set(vueReport.cache["-100"], "heroes", response.data.desc);
				updateCache();
			}).catch(function(error) {
				console.log("heroesGetter : " + error);
			});
		}
	},
	drawPK: function(seStudentID) {
		axios.get(vueReport.exam.base + "/app/student/cj/stu-pk?seid=" + vueReport.exam.id + "&sestudentid=" + seStudentID, {withCredentials:true}).then(function(response) {
			if(response.data.result != 1) {
				wishApp.callSessionException(response.data.result);
			}
			var res = response.data.desc;
			vueReport.myScore = res.myScore;
			vueReport.pkScore = res.pkScore;
			vueReport.loading = false;
			charts.drawPK("pkChart", res);
		}).catch(function(error) {
			console.log("drawPK : " + error);
		});
	},
	// 获取理想成绩
	idealGetter: function() {
		if(vueReport.cache["-100"].ideals == undefined) {
			Vue.set(vueReport.cache["-100"], "ideals", {});
		}
		if(vueReport.cache["-100"].ideals[vueReport.subject.id] == undefined) {
			axios.get(vueReport.exam.base + "/app/student/cj/score?seid=" + vueReport.exam.id + "&subjectid=" + vueReport.subject.id, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				var ideals = [],
				stuOrder = vueReport.cache['-100'].stuOrder;
				ideals.push({
					title: vueReport.subject.name + "成绩",
					org: response.data.desc.score,
					change: 0,
					changed: false,
					type:"add"
				});
				if(stuOrder.classOrderShow) {
					ideals.push({
						title: "班级排名",
						org: response.data.desc.classOrder,
						change: 0,
						changed: false,
						type:"minus"
					});
				}
				if(stuOrder.schoolOrderShow) {
					ideals.push({
						title: "校排名",
						org: response.data.desc.schoolOrder,
						change: 0,
						changed: false,
						type:"minus"
					});
				}
				if(stuOrder.unionOrderShow) {
					ideals.push({
						title: vueReport.cache["-100"].examTypeStr + "排名",
						org: response.data.desc.unionOrder,
						change: 0,
						changed: false,
						type:"minus"
					});
				}
				Vue.set(vueReport.cache["-100"].ideals, vueReport.subject.id, ideals);
				Vue.set(vueReport, "ideals", vueReport.cache["-100"].ideals[vueReport.subject.id]);
				updateCache();
			}).catch(function(error) {
				console.log("idealGetter : " + error);
			});
		} else {
			Vue.set(vueReport, "ideals", vueReport.cache["-100"].ideals[vueReport.subject.id]);
		}
	},
	// 获取理想成绩变化
	idealChangeGetter: function(subjectID, score) {
		axios.get(vueReport.exam.base + "/app/student/cj/reckon?seid=" + vueReport.exam.id + "&subjectid=" + vueReport.subject.id + "&score=" + score, {withCredentials:true}).then(function(response) {
			if(response.data.result != 1) {
				wishApp.callSessionException(response.data.result);
			}
			var res = response.data.desc,
			stuOrder = vueReport.cache['-100'].stuOrder;

			Vue.set(vueReport.ideals[0], "change", res.scoreChange);
			Vue.set(vueReport.ideals[0], "changed", res.scoreChange != "-");
			if(stuOrder.classOrderShow) {
				Vue.set(vueReport.ideals[1], "change", res.classOrderChange);
				Vue.set(vueReport.ideals[1], "changed", res.classOrderChange != "-");
			}
			if(stuOrder.schoolOrderShow) {
				Vue.set(vueReport.ideals[2], "change", res.schoolOrderChange);
				Vue.set(vueReport.ideals[2], "changed", res.schoolOrderChange != "-");
			}
			if(stuOrder.unionOrderShow) {
				Vue.set(vueReport.ideals[3], "change", res.unionOrderChange);
				Vue.set(vueReport.ideals[3], "changed", res.unionOrderChange != "-");
			}
		}).catch(function(error) {
			console.log("idealGetter : " + error);
		});
	},
	// 获取试题推送的编号
	pushGetter:function() {
		axios.get(vueReport.exam.base + "/app/student/push/getPushForSe?seid=" + vueReport.exam.id + "&subjectid=" + vueReport.subject.id, {withCredentials:true}).then(function(response) {
			if(response.data.result != 1) {
				wishApp.callSessionException(response.data.result);
			}
			var res = response.data.desc;
			Vue.set(vueReport.subject, "pushID", res.pushid);
		}).catch(function(error) {
			console.log("pushGetter : " + error);
		});
	},

	// 各难度丢分题
	loseQuestionGetter: function() {
		var target, url;
		if(vueReport.exam.nsflag == "0"){
			target = vueReport.cache[vueReport.subject.id];
			url = vueReport.exam.base + "/app/student/cj/lose-question-list?seid=" + vueReport.exam.id + "&subjectid=" + vueReport.subject.id;
		}
		if(vueReport.exam.nsflag == "1"){
			target = vueReport.cache[vueReport.subject.id];
			url = vueReport.exam.base + "/app/student/ns/lose-question-list?seid=" + vueReport.subject.seID + "&subjectid=" + vueReport.subject.id + "&examcode=" + vueReport.subject.examCode;
		}
		if(target.difLoses == undefined) {
			axios.get(url, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				var res = response.data.desc;
				Vue.set(target, "difLoses", res);
				updateCache();
				Vue.set(vueReport, "loses", res);
				Vue.set(vueReport, "loading", false);
			}).catch(function(error) {
				console.log("idealGetter : " + error);
			});
		} else {
			Vue.set(vueReport, "loses", target.difLoses);
			Vue.set(vueReport, "loading", false);
		}
	},
	// 试卷解析
	analysisGetter: function(id, name,index) {
		var target, url;
		if(vueReport.exam.nsflag == "0"){
			target = vueReport.cache[id];
			url = vueReport.exam.base + "/app/student/cj/question-list?seid=" + vueReport.exam.id + "&subjectid=" + id;
		}
		if(target.questions == undefined){
			axios.get(url, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				Vue.set(target, "questions", response.data.desc.questions);
				Vue.set(target, "score", response.data.desc.score);
				Vue.set(target, "total", response.data.desc.totalScore);
				Vue.set(target, "scoreFlag", response.data.desc.scoreFlag===true);

				Vue.set(vueReport, "questions", response.data.desc.questions);
				Vue.set(vueReport, "score", response.data.desc.score);
				Vue.set(vueReport, "total", response.data.desc.totalScore);
				Vue.set(vueReport, "scoreFlag", response.data.desc.scoreFlag===true);

				updateCache();
				vueReport.analysisSwitch(id, name, index);
				vueReport.loading = false;
			}).catch(function(error) {
				console.log("analysisGetter : " + error);
			});
		}else{
			Vue.set(vueReport, "questions", target.questions);
			Vue.set(vueReport, "score", target.score);
			Vue.set(vueReport, "total", target.total);
			vueReport.loading = false;
		}
	},
	nsAnalysisGetter: function(id, subjectID, name, seID, examCode, index) {
		var target = vueReport.cache[id], url = vueReport.exam.base + "/app/student/ns/question-list?seid=" + seID + "&subjectid=" + id + "&examcode="+ examCode;
		if(target.questions == undefined){
			axios.get(url, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				Vue.set(target, "questions", response.data.desc.questions);
				Vue.set(target, "score", response.data.desc.score);
				Vue.set(target, "total", response.data.desc.totalScore);

				Vue.set(vueReport, "questions", response.data.desc.questions);
				Vue.set(vueReport, "score", response.data.desc.score);
				Vue.set(vueReport, "total", response.data.desc.totalScore);

				updateCache();
				vueReport.analysisNsSwitch(id, subjectID, name, seID, examCode,index);
				vueReport.loading = false;
			}).catch(function(error) {
				console.log("analysisGetter : " + error);
			});
		}else{
			Vue.set(vueReport, "questions", target.questions);
			Vue.set(vueReport, "score", target.score);
			Vue.set(vueReport, "total", target.total);
			vueReport.loading = false;
		}
	},
	// 试题详细信息
	detailGetter: function() {
		var target, url;
		if(vueReport.exam.nsflag == "0"){
			target = vueReport.cache[vueReport.subject.id];
			url = vueReport.exam.base + "/app/student/cj/question?seid=" + vueReport.exam.id + "&questionid=" + vueReport.questionID;
		}
		if(vueReport.exam.nsflag == "1"){
			target = vueReport.cache[vueReport.subject.id];
			url = vueReport.exam.base + "/app/student/ns/question?seid=" + vueReport.subject.seID + "&questionid=" + vueReport.questionID+ "&examcode=" + vueReport.subject.examCode;
		}

		if(vueReport.questions.length == 0){
			var questions = [];
			for(var q = 0; q < target.questions.length; q++){
				if(vueReport.errorOnly){
					if(target.questions[q].score != target.questions[q].totalScore){
						questions.push(target.questions[q]);
					}
				}else{
					questions.push(target.questions[q]);
				}
			}
			Vue.set(vueReport, "questions", questions);
		}
		if(vueReport.questions[vueReport.questionIndex]['type'] == undefined) {
			axios.get(url, {withCredentials:true}).then(function(response) {
				if(response.data.result != 1) {
					wishApp.callSessionException(response.data.result);
				}
				var res = response.data.desc;
				// 获取数据
				for(var q = 0;q < target.questions.length; q++) {
					question = target.questions[q];
					if(res.id == question.id) {
						question.dif = res.dif;
						question.questionContent = res.questionContent;
						question.answerDesc = res.answerDesc;
						question.studentAnswer = res.studentAnswer;
						question.pic = [];
						for(var i = 0; i < res.urls.length; i++){
							let url = res.urls[i];
							question.pic.push(/^http(s)*.*$/.test(url) ? url : (vueReport.exam.base + url));
						}
						question.standardAnswer = res.standardAnswer;
						question.type = res.type;
						question.testAbility = res.testAbility;
						question.rate = res.rate;
						question.knowledge = res.knowledge;
						break;
					}
				}
				// 获取正确Index
				for(var q = 0; q < vueReport.questions.length; q++){
					if(res.id == vueReport.questions[q].id){
						vueReport.questionIndex = q;
					}
				}
				Vue.set(vueReport, "question", question);

				// 获取学霸答案
				if(!vueReport.vip.xbda && res.type==0 && !res.bqFlag){
					dataGetter.xbQuestionGetter();
				}
				vueReport.loading = false;
			}).catch(function(error) {
				console.log("detailGetter : " + error);
			});
		} else {
			for(var q = 0; q < vueReport.questions.length; q++) {
				var question = vueReport.questions[q];
				if(vueReport.questionID == question.id) {
					Vue.set(vueReport, "question", question);
					vueReport.questionIndex = q;

					// 获取学霸答案
					if(!vueReport.vip.xbda && question.type==0 && !question.bqFlag){
						dataGetter.xbQuestionGetter();
					}
					break;
				}
			}
			vueReport.loading = false;
		}
	},
	// 学霸答案
	xbQuestionGetter: function() {
		var url;
		if(vueReport.exam.nsflag == "0"){
			url = vueReport.exam.base + "/app/student/cj/xbda?seid=" + vueReport.exam.id + "&questionid=" + vueReport.questionID + "&studentid=" + vueReport.xbStudentID;
		}
		if(vueReport.exam.nsflag == "1"){
			url = vueReport.exam.base + "/app/student/cj/xbda?seid=" + vueReport.subject.seID + "&questionid=" + vueReport.questionID + "&studentid=" + vueReport.xbStudentID;
		}

		axios.get(url, {withCredentials:true}).then(function(response) {
			if(response.data.result != 1) {
				wishApp.callSessionException(response.data.result);
			}
			res = response.data.desc;
			vueReport.xbStudentID = res.studentID;
			vueReport.xbScore = res.score;
			vueReport.xbPic = []
			for(var i = 0; i < res.urls.length; i++){
				let url = res.urls[i];
				vueReport.xbPic.push(/^http(s)*.*$/.test(url) ? url : (vueReport.exam.base + url));
			}
			console.log(vueReport.xbPic)
		}).catch(function(error) {
			console.log("xbQuestionGetter : " + error);
		});
	},
	/** 新高考 */
	nsTotalGetter: function(){
		var nsID = vueReport.exam.id, base = vueReport.exam.base;
		if(vueReport.cache["-100"].init){
			axios.get(base + "/app/student/ns/stu-ns-card?nsid=" + nsID, {withCredentials:true}).then(function(response){
				if(response.data.result	!= 1){
					wishApp.callSessionException(response.data.result);
				}
				var data = response.data.desc;

				var totalOrderMnpm = data.totalOrder;
				var schoolOrderMnpm = data.schoolOrder;
				var totalNumMnpm = data.totalNum;
				var schoolNumMnpm = data.schoolNum;

				Vue.set(vueReport.cache, "totalOrderMnpm", totalOrderMnpm);
				Vue.set(vueReport.cache, "schoolOrderMnpm", schoolOrderMnpm);
				Vue.set(vueReport.cache, "totalNumMnpm", totalNumMnpm);
				Vue.set(vueReport.cache, "schoolNumMnpm", schoolNumMnpm);

				Vue.set(vueReport.cache, "-100", data);
				Vue.set(vueReport.cache['-100'], "showBkzn", data.showBkzn);
				Vue.set(vueReport.cache['-100'], "subjectNames", "不限");
				Vue.set(vueReport.cache['-100'], "subjectIDs", []);
				Vue.set(vueReport.cache, "lastmodified", vueReport.exam.lastmodified);
				updateCache();

			}).catch(function(error){
				console.log("scoresGetter : " + error);
			});
		}
	},
	mnpmGetter: function(subjectIDs){
		var nsID = vueReport.exam.id, base = vueReport.exam.base;
		var score = vueReport.cache["-100"].totalScore;
		var str = "";
		if(subjectIDs.length > 0){
			for(var i = 0; i<subjectIDs.length; i++)
			{
				str = str+"&subjectids="+subjectIDs[i];
			}
		}
		axios.get(base + "/app/student/ns/stu-ns-order?nsid=" + nsID + "&score=" + score + str, {withCredentials:true}).then(function(response){
			if(response.data.result	!= 1){
				wishApp.callSessionException(response.data.result);
			}
			var data = response.data.desc;

			var totalOrderMnpm = data.totalOrder;
			var schoolOrderMnpm = data.schoolOrder;
			var totalNumMnpm = data.totalNum;
			var schoolNumMnpm = data.schoolNum;

			Vue.set(vueReport.cache, "totalOrderMnpm", totalOrderMnpm);
			Vue.set(vueReport.cache, "schoolOrderMnpm", schoolOrderMnpm);
			Vue.set(vueReport.cache, "totalNumMnpm", totalNumMnpm);
			Vue.set(vueReport.cache, "schoolNumMnpm", schoolNumMnpm);
			updateCache();

		}).catch(function(error){
			console.log("scoresGetter : " + error);
		});
	},
	nsSubjectsGetter: function(){
		var nsID = vueReport.exam.id, base = vueReport.exam.base;
		if(vueReport.cache.subjects === undefined){	// 处理科目列表
			axios.get(base + "/app/student/ns/stu-ns-subject?nsid=" + nsID, {withCredentials:true}).then(function(response){
				if(response.data.result	!= 1){
					wishApp.callSessionException(response.data.result);
				}
				var subjects = [{subjectName:"全科",nsSubjectID: -100,seSubjectID: -100}];
				Vue.set(vueReport.cache, "subjects", subjects.concat(response.data.desc));
				updateCache();
			}).catch(function(error){
				console.log("subjectsGetter : " + error);
			});
		}
	},
	/** 新高考单科部分 */
	nsSubjectGetter: function(seSubjectID,subjectID, name, seID, examCode, index){
		axios.get(vueReport.exam.base + "/app/student/ns/report-subject?seid=" + seID + "&subjectid=" + seSubjectID + "&examcode=" + examCode, {withCredentials:true}).then(function(response){
			if(response.data.result	!= 1){
				wishApp.callSessionException(response.data.result);
			}
			var data = response.data.desc, scoreGap = data.stuOrder.scoreGap;
			var stuOrder = {
				gaps: [],
				topShow: data.topFlag != 0,
				avgShow: data.avgFlag != 0
			};
			// 处理分数差距数据
			stuOrder.gaps[0] = {type:"class", name: "班级", num: scoreGap.classNum, top: scoreGap.classTop, avg: scoreGap.classAvg, FV: scoreGap.classFV};
			stuOrder.gaps[1] = {type:"school", name: "学校", num: scoreGap.schoolNum, top: scoreGap.schoolTop, avg: scoreGap.schoolAvg, FV: scoreGap.schoolFV};
			if(data.examType != 0){stuOrder.gaps[2] = {type:"union", name: data.examTypeStr, num: scoreGap.unionNum, top: scoreGap.unionTop, avg: scoreGap.unionAvg, FV: scoreGap.unionFV};}
			for(var g=0; g < stuOrder.gaps.length; g++){
				if((data.topFlag == 2 && stuOrder.gaps[g].type == "union") || (data.topFlag == 3 && (stuOrder.gaps[g].type == "union" || stuOrder.gaps[g].type == "school"))){ stuOrder.gaps[g].top = "-";}
				if((data.avgFlag == 2 && stuOrder.gaps[g].type == "union") || (data.avgFlag == 3 && (stuOrder.gaps[g].type == "union" || stuOrder.gaps[g].type == "school"))){ stuOrder.gaps[g].avg = "-";}
			}
			stuOrder.scoreGapDesc = filterStuOrderDesc(data.stuOrder.scoreGapDesc);
			data.stuOrder = stuOrder;
			// 难度失分分析
			data.loses = [{title:"简单题"},{title:"中等题"},{title:"难题"}];
			for(var l = 0; l < 3; l++){
				data.loses[l].num = data["loseScoreCount" + (l + 1)];
				data.loses[l].total = data["loseTotalScore" + (l + 1)];
				data.loses[l].lose = data["loseScore" + (l + 1)];
				data.loses[l].rate = data["loseTotalRateScore" + (l + 1)];
				delete data["loseScoreCount" + (l + 1)];
				delete data["loseTotalScore" + (l + 1)];
				delete data["loseScore" + (l + 1)];
				delete data["loseTotalRateScore" + (l + 1)];
			}
			// 提分指导
			var guide = {
				totalScore: data.questiontotalScore,
				analysisDesc: data.analysisDesc,
				improves: []
			}
			var showAbi = false;
			var showKnowledge = false;
			if(data.questions1Score > 0 && data.questions1.length > 0) {
				showAbi = false;
				showKnowledge = false;
				for(var q = 0; q < data.questions1.length; q++){
					var question = data.questions1[q];
					if(question.ability.length > 0){
						showAbi = true;
					}
					if(question.knowledge.length > 0){
						showKnowledge = true;
					}
				}

				guide.improves.push({
					title: "可快速提升空间",
					subTitle: "同水平学生及大多数同学已掌握题目：",
					data: data.questions1,
					score: data.questions1Score,
					type: "fast",
					showAbi: showAbi,
					showKnowledge: showKnowledge
				});
			}
			if(data.questions2Score > 0 && data.questions2.length > 0) {
				showAbi = false;
				showKnowledge = false;
				for(var q = 0; q < data.questions2.length; q++){
					var question = data.questions2[q];
					if(question.ability.length > 0){
						showAbi = true;
					}
					if(question.knowledge.length > 0){
						showKnowledge = true;
					}
				}
				guide.improves.push({
					title: "可稳固提升空间",
					subTitle: "同水平学生已掌握、可攻克的题目：",
					data: data.questions2,
					score: data.questions2Score,
					type: "improve",
					showAbi: showAbi,
					showKnowledge: showKnowledge
				});
			}
			if(data.questions3.length > 0) {
				showAbi = false;
				showKnowledge = false;
				for(var q = 0; q < data.questions3.length; q++){
					var question = data.questions3[q];
					if(question.ability.length > 0){
						showAbi = true;
					}
					if(question.knowledge.length > 0){
						showKnowledge = true;
					}
				}
				guide.improves.push({
					title: "注重巩固空间",
					subTitle: "比同水平学生掌握好的题目，要巩固学习，避免猜中答案而忽略知识点漏洞",
					data: data.questions3,
					score: 0,
					type: "attention",
					showAbi: showAbi,
					showKnowledge: showKnowledge
				});
			}
			Vue.set(vueReport.cache, seSubjectID, {});
			Vue.set(vueReport.cache[seSubjectID], "loses", data.loses);
			Vue.set(vueReport.cache[seSubjectID], "stuOrder", data.stuOrder);
			Vue.set(vueReport.cache[seSubjectID], "questRates", data.questRates);
			Vue.set(vueReport.cache[seSubjectID], "guide", guide);
			Vue.set(vueReport.cache[seSubjectID], "examType", data.examType);
			Vue.set(vueReport.cache[seSubjectID], "examTypeStr", data.examTypeStr);
			Vue.set(vueReport.cache[seSubjectID], "orderFlag", data.orderFlag);
			Vue.set(vueReport.cache[seSubjectID], "segmentFlag", data.segmentFlag);
			Vue.set(vueReport.cache[seSubjectID], "avgFlag", data.avgFlag);
			Vue.set(vueReport.cache[seSubjectID], "questionRateShow",data.questionRateShow);
			Vue.set(vueReport.cache[seSubjectID], "questionScoreShow",data.questionScoreShow);
			if(vueReport.cache[vueReport.subject.id].segmentFlag == 3){
				vueReport.segment.tag = "class";
				vueReport.segment.segmentVip = vueReport.vip.bjndwz;
			}

			updateCache();
			vueReport.subjectSwitch(seSubjectID, subjectID, name, seID, examCode, index);
		}).catch(function(error){
			console.log("scoresGetter : " + error);
		});
	},
	setCurrentExam: function(exam) {
		// 【核心破解 1】欺骗底层数据对象，让系统以为当前是 VIP 考试
		if(exam) {
			exam.vipstate = 3;
			exam.allowfree = "true";
			exam.showsjjvip = "false";
		}
		Vue.set(vueReport, "exam", exam);
		this.setVip(exam);
	},
	setVip: function(data) {
		// 【核心破解 2】将所有会引发“VIP屏蔽遮罩”的参数强行设为 false（即无需开通VIP）
		// 原代码会通过判定服务器传回来的 vipflag 来限制访问，我们直接将其屏蔽。
		var vip = {
			njpm: false, // 年级排名
			lkpm: false, // 联考排名
			fscj: false, // 分数差距
			hlz: false, // 火力值
			cjqs: false, // 成绩趋势
			bjndwz: false, // 班级你的位置
			njndwz: false, // 年级你的位置
			lkndwz: false, // 联考你的位置
			yxb: false, // 英雄榜
			qkdny: false, // 乾坤大挪移
			lxcj: false, // 理想成绩
			brxk: false, // 薄弱学科
			tfzd: false, // 提分指导
			dtzd: false, // 答题诊断
			brd: false, // 薄弱点
			xbda: false, // 学霸答案
			tmjx: false, // 题目解析
			dtk: false, // 答题卡
			sj: false, // 试卷
			dahjx: false // 答案解析
		};
		Vue.set(vueReport, "vip", vip);
	}
};
// 返回Session缓存
function getSessionCache(key, val) {
	// 初始化当前考试
	if(key == "sub1") {
		var sub = JSON.parse(val);
		if(sub.subject != undefined) {
			Vue.set(vueReport, "subject", sub.subject);
		}
		Vue.set(vueReport, "top", sub.top != undefined ? sub.top : 0);
	}
	if(key == "sub2") {
		if(val.length > 0){
			var sub = JSON.parse(val);
			if(sub.subject != undefined) {
				Vue.set(vueReport, "subject", sub.subject);
			}
			Vue.set(vueReport, "top", sub.top);
			Vue.set(vueReport, "questionID", sub.questionID);
			Vue.set(vueReport, "errorOnly", sub.errorOnly);
		}else{
			Vue.set(vueReport, "top", 0);
		}
	}
	if(key == "current_report") {
		//		document.write(val);
		var current = JSON.parse(filter(val));
		dataGetter.setCurrentExam(current);
		wishApp.callLocalCache(current.id + "_" + current.childid + "_" + current.nsflag);
	}
}

function filterStuOrderDesc(desc){
	// 【核心破解 3】取消非会员下的“成绩分析文字截断”，直接全量展示完整文本
	if(!desc) return "";
	return desc.split(",").join(",");
}

function filter(str){
	str=str.replace(/\\/g,"\\\\");
	str=str.replace(/\n/g,"\\n");
	str=str.replace(/\r/g,"\\r");
	str=str.replace(/\t/g,"\\t");
	str=str.replace(/("")+/g,"\"\"");
	str=str.replace(/\'/g,"&#39;");
	str=str.replace(/ /g,"&nbsp;");
	str=str.replace(/</g,"&lt;");
	str=str.replace(/>/g,"&gt;");

	return str;
}

// 返回Local数据缓存
function getLocalCache(key, val) {
	var curKey = vueReport.exam.id + "_" + vueReport.exam.childid + "_" + vueReport.exam.nsflag;
	if(key == curKey) {
		if(val.length > 0) {
			var cache = JSON.parse(filter(val));
			if(vueReport.exam.lastmodified != cache.lastmodified) {
				wishApp.clearLocalCache(key);
			} else {
				Vue.set(vueReport, "cache", cache);
			}
		}
		vueReport.dataInit();
	}
}
// 提交缓存
function updateCache() {
	var exam = vueReport.exam;
	wishApp.setLocalCache(exam.id + "_" + exam.childid + "_" + exam.nsflag,JSON.stringify(vueReport.cache));
}
